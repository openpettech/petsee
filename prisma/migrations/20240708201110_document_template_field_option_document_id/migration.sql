/*
  Warnings:

  - Added the required column `documentTemplateId` to the `document_template_field_options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_template_field_options" ADD COLUMN     "documentTemplateId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "document_template_field_options" ADD CONSTRAINT "document_template_field_options_documentTemplateId_fkey" FOREIGN KEY ("documentTemplateId") REFERENCES "document_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
