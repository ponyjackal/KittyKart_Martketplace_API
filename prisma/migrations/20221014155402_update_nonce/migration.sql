-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "nonce" DROP DEFAULT;
DROP SEQUENCE "Account_nonce_seq";
