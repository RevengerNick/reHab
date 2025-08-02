/*
  Warnings:

  - You are about to drop the column `publicId` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `name` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Channel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_publicId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "publicId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
