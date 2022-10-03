/*
  Warnings:

  - You are about to drop the column `animation_url` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `background_color` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `collection_address` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `external_url` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `minted_at` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `owner_address` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `reqest_from` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `trait_type` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animation_url` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `image_id` on the `ImageAttribute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `request_from` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ATTRIBUTE_USE_STATUS" AS ENUM ('NOT_APPLIED', 'CURRENTLY_APPLIED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "animation_url",
DROP COLUMN "background_color",
DROP COLUMN "collection_address",
DROP COLUMN "description",
DROP COLUMN "external_url",
DROP COLUMN "image",
DROP COLUMN "minted_at",
DROP COLUMN "name",
DROP COLUMN "owner_address",
ADD COLUMN     "in_use" "ATTRIBUTE_USE_STATUS" NOT NULL DEFAULT 'NOT_APPLIED',
ADD COLUMN     "trait_type" TEXT NOT NULL,
ADD COLUMN     "value" TEXT;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "url",
ADD COLUMN     "animation_url" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImageAttribute" DROP COLUMN "image_id",
ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "reqest_from",
ADD COLUMN     "request_from" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Kart" ADD CONSTRAINT "Kart_owner_address_fkey" FOREIGN KEY ("owner_address") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kart" ADD CONSTRAINT "Kart_collection_address_fkey" FOREIGN KEY ("collection_address") REFERENCES "Collection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_owner_address_fkey" FOREIGN KEY ("owner_address") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_collection_address_fkey" FOREIGN KEY ("collection_address") REFERENCES "Collection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("token_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_kart_id_fkey" FOREIGN KEY ("kart_id") REFERENCES "Kart"("token_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_collection_address_fkey" FOREIGN KEY ("collection_address") REFERENCES "Collection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("listing_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_request_from_fkey" FOREIGN KEY ("request_from") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAttribute" ADD CONSTRAINT "ImageAttribute_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
