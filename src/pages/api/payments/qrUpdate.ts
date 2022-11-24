import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import QRPPTransactionData from "@/types/QRPPTransactionData";
import QRPPStatus from "@/types/QRRPStatus";
import DatabaseInstance from "@/lib/DatabaseInstance";
import InternalTransactionStatus from "@/types/InternalTransactionStatus";
import axios from "axios";

interface InternalStatusChange {
  status: InternalTransactionStatus.SUCCESS | InternalTransactionStatus.FAILURE;
}

async function updatePaymentInternal(
  transactionId: string,
  newStatus: QRPPStatus
): Promise<InternalStatusChange> {
  const db = DatabaseInstance.getInstance().getConnection();
  try {
    const foundTransaction = await db.transaction.findUnique({
      where: {
        QRtransactionId: transactionId,
      },
    });

    if (!foundTransaction) {
      return {
        status: InternalTransactionStatus.FAILURE,
      };
    }

    await db.transaction.update({
      where: {
        QRtransactionId: transactionId,
      },
      data: {
        status: newStatus === QRPPStatus.ACCEPTED ? "Success" : "Rejected",
      },
    });

    return {
      status: InternalTransactionStatus.SUCCESS,
    };
  } catch (error) {
    return {
      status: InternalTransactionStatus.FAILURE,
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
  const { transactionId, newStatus } = req.body || {};
  if (!transactionId || !newStatus) {
    return res.status(400).json({ message: "Bad Request" });
  }
  if (newStatus !== QRPPStatus.ACCEPTED && newStatus !== QRPPStatus.REJECTED) {
    return res.status(400).json({ message: "Wrong transaction status" });
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
    //       Authorization: `X-QRPP-Api-Key ${process.env.QRPP_SECRET_KEY}`,
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

    if (data.transactionData.status !== QRPPStatus.PENDING) {
      return res.status(400).json({ message: "Wrong transaction status" });
    }

    const internalPayment = await updatePaymentInternal(transactionId, newStatus);

    if (internalPayment.status === InternalTransactionStatus.FAILURE) {
      return res.status(400).json({ message: "Bad request" });
    }

    // await axios.post(
    //   `${process.env.QRPP_ENDPOINT_URL}/updateTransactionStatus`,
    //   {
    //     transactionId,
    //     action: newStatus === QRPPStatus.ACCEPTED ? "CONFIRM" : "REJECT",
    //   },
    //   {
    //     headers: {
    //       Authorization: `X-QRPP-Api-Key ${process.env.QRPP_SECRET_KEY}`,
    //     },
    //   }
    // );

    return res.status(200).json({ message: "OK" });
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
