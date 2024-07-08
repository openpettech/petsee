/*
  Warnings:

  - You are about to drop the column `type` on the `resource_types` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resource_types" DROP COLUMN "type",
ADD COLUMN     "status" "ResourceTypeStatus" NOT NULL DEFAULT 'ACTIVE';
