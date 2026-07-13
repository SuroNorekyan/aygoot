-- AlterEnum
ALTER TYPE "HouseStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "preferredLocale" TEXT;
