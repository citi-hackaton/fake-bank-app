import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function main() {
  console.log("Seeding...");

  const hashedPassword = await hashPassword("admin");

  const user = await prisma.user.findUnique({
    where: { name: "admin" },
  });

  //   await prisma.user.create({
  //     data: {
  //       name: "admin",
  //       password: "admin",
  //       email: "admin@example.com",
  //     },
  //   });

  console.log("Seeding done.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
