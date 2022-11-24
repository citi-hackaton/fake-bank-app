/*
  Warnings:

  - A unique constraint covering the columns `[QRtransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_QRtransactionId_key" ON "Transaction"("QRtransactionId");
