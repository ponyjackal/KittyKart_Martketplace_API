/*
  Warnings:

  - Added the required column `collection_address` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "collection_address" TEXT NOT NULL,
ADD COLUMN     "token_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_collection_address_fkey" FOREIGN KEY ("collection_address") REFERENCES "Collection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
