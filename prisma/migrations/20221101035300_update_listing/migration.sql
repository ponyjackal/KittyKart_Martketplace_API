/*
  Warnings:

  - You are about to drop the column `listing_id` on the `Listing` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Listing_listing_id_key";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "listing_id";
