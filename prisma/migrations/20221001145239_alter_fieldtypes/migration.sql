/*
  Warnings:

  - Made the column `description` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `external_url` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `Attribute` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "external_url" SET NOT NULL;

-- AlterTable
ALTER TABLE "Attribute" ALTER COLUMN "value" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_seller_address_fkey" FOREIGN KEY ("seller_address") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_buyer_address_fkey" FOREIGN KEY ("buyer_address") REFERENCES "Account"("address") ON DELETE SET NULL ON UPDATE CASCADE;
