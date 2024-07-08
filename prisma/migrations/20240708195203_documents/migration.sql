-- CreateEnum
CREATE TYPE "DocumentTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DocumentTemplateFieldStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DocumentTemplateFieldType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'NUMBER', 'DATE', 'CHECKBOX', 'SELECT', 'MULTI_SELECT');

-- CreateEnum
CREATE TYPE "DocumentTemplateFieldOptionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CustomFieldModel" ADD VALUE 'DOCUMENT_TEMPLATE';
ALTER TYPE "CustomFieldModel" ADD VALUE 'DOCUMENT_TEMPLATE_FIELD';
ALTER TYPE "CustomFieldModel" ADD VALUE 'DOCUMENT_TEMPLATE_FIELD_OPTION';
ALTER TYPE "CustomFieldModel" ADD VALUE 'DOCUMENT';

-- CreateTable
CREATE TABLE "document_templates" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "DocumentTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "document_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_template_fields" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "documentTemplateId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "helperText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "DocumentTemplateFieldStatus" NOT NULL DEFAULT 'ACTIVE',
    "type" "DocumentTemplateFieldType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "document_template_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_template_field_options" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "documentTemplateFieldId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "status" "DocumentTemplateFieldStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "document_template_field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "documentTemplateId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_field_data" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "documentTemplateFieldId" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "document_field_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document_templates" ADD CONSTRAINT "document_templates_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_template_fields" ADD CONSTRAINT "document_template_fields_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_template_fields" ADD CONSTRAINT "document_template_fields_documentTemplateId_fkey" FOREIGN KEY ("documentTemplateId") REFERENCES "document_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_template_field_options" ADD CONSTRAINT "document_template_field_options_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_template_field_options" ADD CONSTRAINT "document_template_field_options_documentTemplateFieldId_fkey" FOREIGN KEY ("documentTemplateFieldId") REFERENCES "document_template_fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_documentTemplateId_fkey" FOREIGN KEY ("documentTemplateId") REFERENCES "document_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_field_data" ADD CONSTRAINT "document_field_data_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_field_data" ADD CONSTRAINT "document_field_data_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_field_data" ADD CONSTRAINT "document_field_data_documentTemplateFieldId_fkey" FOREIGN KEY ("documentTemplateFieldId") REFERENCES "document_template_fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
