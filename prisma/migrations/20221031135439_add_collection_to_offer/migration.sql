/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImageAttribute" DROP CONSTRAINT "ImageAttribute_image_id_fkey";

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "listed_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "ImageAttribute";

-- CreateTable
CREATE TABLE "KartImage" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "animation_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "traits" JSONB NOT NULL,

    CONSTRAINT "KartImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetImage" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "animation_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "traits" JSONB NOT NULL,

    CONSTRAINT "AssetImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KartImage_traits_key" ON "KartImage"("traits");

-- CreateIndex
CREATE UNIQUE INDEX "AssetImage_traits_key" ON "AssetImage"("traits");
