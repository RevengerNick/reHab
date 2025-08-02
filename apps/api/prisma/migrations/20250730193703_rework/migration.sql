/*
  Warnings:

  - You are about to drop the column `projectId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Log` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_projectId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "projectId",
ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "projectId",
ADD COLUMN     "publicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_publicId_fkey" FOREIGN KEY ("publicId") REFERENCES "Project"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_publicId_fkey" FOREIGN KEY ("publicId") REFERENCES "Project"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;
