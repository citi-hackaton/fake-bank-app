import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import DatabaseInstance from "@/lib/DatabaseInstance";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await handlePOST(req, res);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = DatabaseInstance.getInstance().getConnection();
    const { name, password } = req.body || {};
    if (!name || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: { name: req.body.name, password: hashedPassword },
    });
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (errror) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
