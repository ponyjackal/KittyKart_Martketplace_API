/*
  Warnings:

  - You are about to drop the column `listing_id` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `requested_at` on the `Offer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_listing_id_fkey";

-- DropIndex
DROP INDEX "Offer_listing_id_key";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "listing_id",
DROP COLUMN "requested_at";
