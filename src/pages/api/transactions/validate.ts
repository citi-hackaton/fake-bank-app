import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import axios from "axios";

interface TransactionValidateResponse {}

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
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { data } = await axios.post<TransactionValidateResponse>(
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
    return res.status(200).json(data);
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
