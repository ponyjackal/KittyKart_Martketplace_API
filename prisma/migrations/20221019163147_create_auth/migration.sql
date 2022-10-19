/*
  Warnings:

  - You are about to drop the column `nonce` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "nonce",
DROP COLUMN "refreshToken",
DROP COLUMN "username";

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_address_key" ON "Auth"("address");
