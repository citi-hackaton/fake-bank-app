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

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const db = DatabaseInstance.getInstance().getConnection();
  const user = await db.user.findUnique({
    where: { name: req.body.username },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password ?? "");

  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password." });
  }

  return res.status(200).json(user);
}
