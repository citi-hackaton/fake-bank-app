import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseInstance from "@/lib/DatabaseInstance";
import { getToken } from "next-auth/jwt";
import { userWithTransactionsSelect } from "@/types/user";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await handleGET(req, res);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const db = DatabaseInstance.getInstance().getConnection();
    const info = await db.user.findFirst({
      where: { id: token.sub },
      select: userWithTransactionsSelect.select,
    });
    return res.status(200).json(info);
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
