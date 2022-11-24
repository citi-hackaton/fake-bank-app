import type { NextApiRequest, NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";
import axios from "axios";
import QRPPTransactionData from "@/types/QRPPTransactionData";
import QRPPStatus from "@/types/QRRPStatus";
import InternalInitializationResponse from "@/types/InternalInitializationResponse";
import InternalTransactionStatus from "@/types/InternalTransactionStatus";
import DatabaseInstance from "@/lib/DatabaseInstance";

async function initializePayment(
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
    const transaction = await db.transaction.create({
      data: {
        amount: data.transactionData.amount,
        type: "QRCode",
        receiverName: data.transactionData.clientName,
        receiverAccount: data.transactionData.bankAccount,
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
  const { transactionId, bankUserId } = req.body || {};
  if (!transactionId || !bankUserId) {
    return res.status(400).json({ message: "Bad Request" });
  }
  try {
    const token = await getToken({ req });
    if (!token || token.sub !== bankUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // In real life, you would need to check if user has access to this transaction
    const { data } = await axios.post<QRPPTransactionData>(
      `${process.env.QRPP_ENDPOINT_URL}/validateTransaction`,
      {
        transactionId,
      },
      {
        headers: {
          Authorization: `X-QRPP-Api-Key ${token.accessToken}`,
        },
      }
    );
    if (data.transactionData.status === QRPPStatus.PENDING) {
      const paymentInitialization = await initializePayment(data, token);

      if (paymentInitialization.status === InternalTransactionStatus.SUCCESS) {
        await axios.post(`${process.env.QRPP_ENDPOINT_URL}/updateTransactionStatus`, {
          transactionId,
          status: QRPPStatus.ACCEPTED,
        });
        return res.status(201).json(paymentInitialization);
      }

      await axios.post(`${process.env.QRPP_ENDPOINT_URL}/updateTransactionStatus`, {
        transactionId,
        status: QRPPStatus.REJECTED,
      });

      return res.status(400).json({ message: "Transaction rejected" });
    }
    return res.status(400).json({ message: "Transaction is not pending" });
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
