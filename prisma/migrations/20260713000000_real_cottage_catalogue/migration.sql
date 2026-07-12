-- CreateEnum
CREATE TYPE "HouseType" AS ENUM ('BIG', 'SMALL', 'STANDARD');

-- AlterTable
ALTER TABLE "House" ADD COLUMN "type" "HouseType" NOT NULL DEFAULT 'STANDARD';
ALTER TABLE "House" ADD COLUMN "priceWorkdaysAmd" INTEGER;
ALTER TABLE "House" ADD COLUMN "priceWeekdaysAmd" INTEGER;

UPDATE "House"
SET
  "priceWorkdaysAmd" = "pricePerNightAmd",
  "priceWeekdaysAmd" = "pricePerNightAmd"
WHERE "priceWorkdaysAmd" IS NULL OR "priceWeekdaysAmd" IS NULL;

ALTER TABLE "House" ALTER COLUMN "priceWorkdaysAmd" SET NOT NULL;
ALTER TABLE "House" ALTER COLUMN "priceWeekdaysAmd" SET NOT NULL;
ALTER TABLE "House" ALTER COLUMN "bedrooms" DROP NOT NULL;
ALTER TABLE "House" ALTER COLUMN "bathrooms" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HouseTranslation" ALTER COLUMN "locationLabel" DROP NOT NULL;
