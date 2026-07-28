-- Add optional Exely room type mapping for administrator-managed direct booking links.
ALTER TABLE "House" ADD COLUMN "exelyRoomTypeId" TEXT;

CREATE UNIQUE INDEX "House_exelyRoomTypeId_key" ON "House"("exelyRoomTypeId");
