/*
  Warnings:

  - You are about to drop the column `publicId` on the `Log` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_publicId_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "publicId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
