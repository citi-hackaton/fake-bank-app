import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import QRPPStatus from "@/types/QRRPStatus";
import DatabaseInstance from "@/lib/DatabaseInstance";
import InternalTransactionStatus from "@/types/InternalTransactionStatus";
import axios from "axios";

interface InternalStatusChange {
  status: InternalTransactionStatus.SUCCESS | InternalTransactionStatus.FAILURE;
}

async function updatePaymentInternal(
  token: string,
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
    const foundUser = await db.user.findUnique({
      where: {
        id: token,
      },
      select: {
        balance: true,
      },
    });

    if (!foundUser) {
      return {
        status: InternalTransactionStatus.FAILURE,
      };
    }

    await db.user.update({
      where: {
        id: token,
      },
      data: {
        balance: foundUser.balance - foundTransaction.amount,
      },
    });

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

    const internalPayment = await updatePaymentInternal(token.sub ?? "", transactionId, newStatus);

    if (internalPayment.status === InternalTransactionStatus.FAILURE) {
      return res.status(400).json({ message: "Bad request" });
    }

    await axios.post(
      `${process.env.QRPP_ENDPOINT_URL}/qrPayments/updateTransactionStatus`,
      {
        transactionId,
        status: newStatus === QRPPStatus.ACCEPTED ? "ACCEPTED" : "REJECTED",
      },
      {
        headers: {
          Authorization: `X-QRPP-Api-Key ${process.env.QRPP_SECRET_KEY}`,
        },
      }
    );

    return res.status(200).json({ message: "OK" });
  } catch (errror) {
    console.log(errror);
    return res.status(500).json({ message: "Internal Server Error", extra: errror });
  }
}
