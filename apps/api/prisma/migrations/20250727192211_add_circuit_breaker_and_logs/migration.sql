-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "failureCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFailureAt" TIMESTAMP(3);
