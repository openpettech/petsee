/*
  Warnings:

  - The `status` column on the `document_template_field_options` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "document_template_field_options" DROP COLUMN "status",
ADD COLUMN     "status" "DocumentTemplateFieldOptionStatus" NOT NULL DEFAULT 'ACTIVE';
