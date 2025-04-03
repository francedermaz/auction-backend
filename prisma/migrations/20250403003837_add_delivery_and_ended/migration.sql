-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "deliveryConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ended" BOOLEAN NOT NULL DEFAULT false;
