/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `TransactionType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_type_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transactionId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "receiverAccount" TEXT,
ADD COLUMN     "receiverAddress" TEXT,
ADD COLUMN     "receiverName" TEXT;

-- DropTable
DROP TABLE "TransactionType";
