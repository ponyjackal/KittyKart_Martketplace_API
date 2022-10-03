/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "nonce" SERIAL NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "price" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "request_price" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
