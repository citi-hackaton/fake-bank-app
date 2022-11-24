import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import QRPPTransactionData from "@/types/QRPPTransactionData";
import QRPPStatus from "@/types/QRRPStatus";

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

    if (data.transactionData.status === QRPPStatus.INITIAL) {
      return res.status(200).json(data);
    }
    return res.status(400).json({ message: "Problems with QR code" });
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
