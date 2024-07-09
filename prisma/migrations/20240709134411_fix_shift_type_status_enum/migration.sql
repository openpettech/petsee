/*
  Warnings:

  - The `status` column on the `shift_types` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "shift_types" DROP COLUMN "status",
ADD COLUMN     "status" "ShiftTypeStatus" NOT NULL DEFAULT 'ACTIVE';
