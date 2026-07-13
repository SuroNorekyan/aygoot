-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM (
  'BOOKING_REQUEST_CUSTOMER',
  'BOOKING_REQUEST_ADMIN',
  'BOOKING_CONFIRMED',
  'BOOKING_REJECTED',
  'BOOKING_CANCELLED',
  'CONTACT_INQUIRY_ADMIN'
);

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "orderId" TEXT;

UPDATE "Booking"
SET "orderId" = 'AYG-' || upper(substr(md5("id"), 1, 8))
WHERE "orderId" IS NULL;

ALTER TABLE "Booking" ALTER COLUMN "orderId" SET NOT NULL;

-- CreateTable
CREATE TABLE "EmailDelivery" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT,
  "type" "EmailType" NOT NULL,
  "recipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EmailDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_orderId_key" ON "Booking"("orderId");
CREATE INDEX "Booking_orderId_createdAt_idx" ON "Booking"("orderId", "createdAt");
CREATE INDEX "EmailDelivery_bookingId_type_idx" ON "EmailDelivery"("bookingId", "type");
CREATE INDEX "EmailDelivery_status_createdAt_idx" ON "EmailDelivery"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "EmailDelivery" ADD CONSTRAINT "EmailDelivery_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
