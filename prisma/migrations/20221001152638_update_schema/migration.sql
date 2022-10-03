/*
  Warnings:

  - Added the required column `display_type` to the `ImageAttribute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageAttribute" ADD COLUMN     "display_type" TEXT NOT NULL;
