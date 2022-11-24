import type { NextApiRequest, NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";
import QRPPTransactionData from "@/types/QRPPTransactionData";
import QRPPStatus from "@/types/QRRPStatus";
import InternalInitializationResponse from "@/types/InternalInitializationResponse";
import InternalTransactionStatus from "@/types/InternalTransactionStatus";
import DatabaseInstance from "@/lib/DatabaseInstance";
import { TransactionStatus } from "@prisma/client";
import InternalInitializationRequestResponse from "@/types/InternalInitializationRequestResponse";

async function initializePayment(
  transactionId: string,
  data: QRPPTransactionData,
  token: JWT
): Promise<InternalInitializationResponse> {
  if (!token) {
    return {
      status: InternalTransactionStatus.FAILURE,
      message: "Unauthorized",
    };
  }
  const bankUserId = token.sub;
  const db = DatabaseInstance.getInstance().getConnection();
  try {
    const user = await db.user.findUnique({
      where: { id: bankUserId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        balance: true,
      },
    });
    if (!user) {
      return {
        status: InternalTransactionStatus.FAILURE,
        message: "User not found",
      };
    }
    if (data.transactionData.amount > user.balance) {
      return {
        status: InternalTransactionStatus.FAILURE,
        message: "Insufficient funds",
      };
    }
    const transactionExists = await db.transaction.findFirst({
      where: {
        QRtransactionId: transactionId,
      },
    });
    // If transaction already exists, return it
    if (transactionExists && transactionExists.status === TransactionStatus.Pending) {
      return {
        status: InternalTransactionStatus.SUCCESS,
        message: "Transaction already exists but was not completed",
      };
    }
    const transaction = await db.transaction.create({
      data: {
        amount: data.transactionData.amount,
        type: "QRCode",
        receiverName: data.transactionData.clientName,
        receiverAccount: data.transactionData.bankAccount,
        status: TransactionStatus.Pending,
        QRtransactionId: transactionId,
        user: {
          connect: {
            id: bankUserId,
          },
        },
      },
    });
    return {
      status: InternalTransactionStatus.SUCCESS,
      message: "Transaction created",
      internalTransactionId: transaction.id,
    };
  } catch (error) {
    return {
      status: InternalTransactionStatus.FAILURE,
      message: "Internal Server Error",
    };
  }
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await handlePOST(req, res);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const { transactionId } = req.body || {};
  if (!transactionId) {
    return res.status(400).json({ message: "Bad Request" });
  }
  try {
    const token = await getToken({ req });
    // In real life, you would need to check if user has access to this transaction
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // const { data } = await axios.post<QRPPTransactionData>(
    //   `${process.env.QRPP_ENDPOINT_URL}/validateTransaction`,
    //   {
    //     transactionId,
    //   },
    //   {
    //     headers: {
    //       Authorization: `X-QRPP-Api-Key ${token.accessToken}`,
    //     },
    //   }
    // );

    const data: QRPPTransactionData = {
      transactionData: {
        amount: 100,
        description: "test",
        clientId: 124124124124,
        clientName: "John Doe",
        bankAccount: "123456789",
        address: "1234 Main St",
        status: QRPPStatus.PENDING,
      },
    };

    if (data.transactionData.status === QRPPStatus.PENDING) {
      const paymentInitialization = await initializePayment(transactionId, data, token);

      if (paymentInitialization.status === InternalTransactionStatus.SUCCESS) {
        const response: InternalInitializationRequestResponse = {
          status: InternalTransactionStatus.SUCCESS,
          paymentDetails: {
            internalTransactionId: paymentInitialization.internalTransactionId,
            ...data.transactionData,
          },
        };
        return res.status(201).json(response);
      }
      return res
        .status(400)
        .json({ message: "Transaction rejected", detailedMessage: paymentInitialization.message });
    }
    return res.status(400).json({ message: "Transaction is not pending" });
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
