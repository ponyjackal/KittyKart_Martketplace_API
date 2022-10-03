-- CreateEnum
CREATE TYPE "LISTING_STATUS" AS ENUM ('ACTIVE', 'SOLD', 'CANCELED');

-- CreateEnum
CREATE TYPE "OFFER_STATUS" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kart" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner_address" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "external_url" TEXT NOT NULL,
    "animation_url" TEXT NOT NULL,
    "background_color" TEXT NOT NULL,
    "minted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner_address" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "image" TEXT,
    "external_url" TEXT,
    "animation_url" TEXT,
    "background_color" TEXT,
    "minted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "kart_id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner_address" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "image" TEXT,
    "external_url" TEXT,
    "animation_url" TEXT,
    "background_color" TEXT,
    "minted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "listing_id" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "token_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "seller_address" TEXT NOT NULL,
    "buyer_address" TEXT,
    "status" "LISTING_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "listed_at" TIMESTAMP(3) NOT NULL,
    "sold_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "listing_id" TEXT NOT NULL,
    "reqest_from" TEXT NOT NULL,
    "request_price" DOUBLE PRECISION NOT NULL,
    "status" "OFFER_STATUS" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageAttribute" (
    "id" SERIAL NOT NULL,
    "image_id" TEXT NOT NULL,
    "trait_type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_address_key" ON "Collection"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Kart_token_id_key" ON "Kart"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_token_id_key" ON "Asset"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_listing_id_key" ON "Listing"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_listing_id_key" ON "Offer"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Account_signature_key" ON "Account"("signature");
