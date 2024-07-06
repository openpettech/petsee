-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "WebhookRequestStatus" AS ENUM ('SUCCEEDED', 'ERRORED');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PHONE_NUMBER', 'EMAIL');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'NUMBER', 'DATE', 'SINGLE_CHECKBOX', 'MULTI_CHECKBOX', 'RADIO', 'JSON', 'SINGLE_SELECT', 'MULTI_SELECT');

-- CreateEnum
CREATE TYPE "CustomFieldModel" AS ENUM ('CUSTOMER', 'ANIMAL', 'SERVICE', 'GROUP', 'MERCHANT', 'FACILITY', 'PERSON');

-- CreateEnum
CREATE TYPE "WeightState" AS ENUM ('SIGNIFICANT_UNDERWEIGHT', 'UNDERWEIGHT', 'PROPER', 'OVERWEIGHT', 'OBESITY');

-- CreateEnum
CREATE TYPE "AnimalOwnershipType" AS ENUM ('OWNER', 'CO_OWNER');

-- CreateEnum
CREATE TYPE "NoteModel" AS ENUM ('CUSTOMER', 'ANIMAL');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('CUSTOMER', 'ANIMAL', 'SERVICE');

-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WarehouseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "StockLedgerType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "ServiceOverrideType" AS ENUM ('CUSTOMER', 'ANIMAL', 'SPECIES', 'BREED', 'FACILITY', 'MERCHANT', 'GROUP', 'PERSON');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('TONNE', 'KILOGRAM', 'GRAM', 'OUNCE', 'POUND');

-- CreateEnum
CREATE TYPE "LengthUnit" AS ENUM ('KILOMETRE', 'METRE', 'CENTIMETRE', 'MILLIMETRE', 'INCH', 'FEET', 'YARD', 'MILE');

-- CreateTable
CREATE TABLE "species" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species_translations" (
    "speciesId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "species_translations_pkey" PRIMARY KEY ("speciesId","locale")
);

-- CreateTable
CREATE TABLE "breeds" (
    "id" UUID NOT NULL,
    "speciesId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breed_translations" (
    "breedId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "breed_translations_pkey" PRIMARY KEY ("breedId","locale")
);

-- CreateTable
CREATE TABLE "reference_categories" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "reference_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_category_translations" (
    "referenceCategoryId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "reference_category_translations_pkey" PRIMARY KEY ("referenceCategoryId","locale")
);

-- CreateTable
CREATE TABLE "reference_values" (
    "id" UUID NOT NULL,
    "speciesId" UUID NOT NULL,
    "referenceCategoryId" UUID NOT NULL,
    "unit" TEXT NOT NULL,
    "min" DOUBLE PRECISION,
    "max" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "reference_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_value_translations" (
    "referenceValueId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "reference_value_translations_pkey" PRIMARY KEY ("referenceValueId","locale")
);

-- CreateTable
CREATE TABLE "allergens" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "allergens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergen_translations" (
    "allergenId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "allergen_translations_pkey" PRIMARY KEY ("allergenId","locale")
);

-- CreateTable
CREATE TABLE "diagnoses" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnose_translations" (
    "diagnoseId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "diagnose_translations_pkey" PRIMARY KEY ("diagnoseId","locale")
);

-- CreateTable
CREATE TABLE "blood_groups" (
    "id" UUID NOT NULL,
    "speciesId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "blood_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_groups_translations" (
    "bloodGroupId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "blood_groups_translations_pkey" PRIMARY KEY ("bloodGroupId","locale")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "events" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_logs" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "webhookId" UUID NOT NULL,
    "request" JSONB NOT NULL,
    "response" JSONB NOT NULL,
    "status" "WebhookRequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "secretKey" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "alternativeEmail" TEXT,
    "phoneNumber" TEXT,
    "alternativePhoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "alternativeEmail" TEXT,
    "phoneNumber" TEXT,
    "alternativePhoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_fields" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "type" "CustomFieldType" NOT NULL,
    "model" "CustomFieldModel" NOT NULL,
    "helpText" TEXT,
    "placeholder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_options" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "customFieldId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "custom_field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_values" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "customFieldId" UUID NOT NULL,
    "objectId" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "custom_field_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "speciesId" UUID NOT NULL,
    "breedId" UUID,
    "crossbreedId" UUID,
    "bloodGroupId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION,
    "weightUnit" "WeightUnit",
    "weightState" "WeightState",
    "height" DOUBLE PRECISION,
    "heightUnit" "LengthUnit",
    "tattooId" TEXT,
    "tattooLocation" TEXT,
    "chipId" TEXT,
    "chipLocation" TEXT,
    "passportId" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "dateOfDeath" TIMESTAMP(3),
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_relationship" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "animalId" UUID NOT NULL,
    "type" "AnimalOwnershipType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "animal_relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "model" "NoteModel" NOT NULL,
    "objectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_associations" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "group_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_associations" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "facilityId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "merchant_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "alternativePhoneNumber" TEXT,
    "email" TEXT,
    "alternativeEmail" TEXT,
    "description" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "BrandStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "brandId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "alternativePhoneNumber" TEXT,
    "email" TEXT,
    "alternativeEmail" TEXT,
    "status" "SupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_ledgers" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "type" "StockLedgerType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "stock_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "alternateName" TEXT,
    "description" TEXT,
    "isBreedRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isSpeciesRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isFacilityRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isMerchantRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isGroupRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isPersonRestricted" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_overrides" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "objectId" UUID NOT NULL,
    "type" "ServiceOverrideType" NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "service_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BreedToService" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AllergenToAnimal" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CustomerToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AnimalToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupToService" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_MerchantToService" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FacilityToService" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ServiceToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ServiceToSpecies" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BreedToService_AB_unique" ON "_BreedToService"("A", "B");

-- CreateIndex
CREATE INDEX "_BreedToService_B_index" ON "_BreedToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AllergenToAnimal_AB_unique" ON "_AllergenToAnimal"("A", "B");

-- CreateIndex
CREATE INDEX "_AllergenToAnimal_B_index" ON "_AllergenToAnimal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomerToTag_AB_unique" ON "_CustomerToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomerToTag_B_index" ON "_CustomerToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnimalToTag_AB_unique" ON "_AnimalToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_AnimalToTag_B_index" ON "_AnimalToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToService_AB_unique" ON "_GroupToService"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToService_B_index" ON "_GroupToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MerchantToService_AB_unique" ON "_MerchantToService"("A", "B");

-- CreateIndex
CREATE INDEX "_MerchantToService_B_index" ON "_MerchantToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityToService_AB_unique" ON "_FacilityToService"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityToService_B_index" ON "_FacilityToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToTag_AB_unique" ON "_ServiceToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToTag_B_index" ON "_ServiceToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToSpecies_AB_unique" ON "_ServiceToSpecies"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToSpecies_B_index" ON "_ServiceToSpecies"("B");

-- AddForeignKey
ALTER TABLE "species_translations" ADD CONSTRAINT "species_translations_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "breed_translations" ADD CONSTRAINT "breed_translations_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "breeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_category_translations" ADD CONSTRAINT "reference_category_translations_referenceCategoryId_fkey" FOREIGN KEY ("referenceCategoryId") REFERENCES "reference_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_values" ADD CONSTRAINT "reference_values_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_values" ADD CONSTRAINT "reference_values_referenceCategoryId_fkey" FOREIGN KEY ("referenceCategoryId") REFERENCES "reference_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_value_translations" ADD CONSTRAINT "reference_value_translations_referenceValueId_fkey" FOREIGN KEY ("referenceValueId") REFERENCES "reference_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergen_translations" ADD CONSTRAINT "allergen_translations_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "allergens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnose_translations" ADD CONSTRAINT "diagnose_translations_diagnoseId_fkey" FOREIGN KEY ("diagnoseId") REFERENCES "diagnoses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_groups" ADD CONSTRAINT "blood_groups_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_groups_translations" ADD CONSTRAINT "blood_groups_translations_bloodGroupId_fkey" FOREIGN KEY ("bloodGroupId") REFERENCES "blood_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "webhooks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_options" ADD CONSTRAINT "custom_field_options_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_options" ADD CONSTRAINT "custom_field_options_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "breeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_crossbreedId_fkey" FOREIGN KEY ("crossbreedId") REFERENCES "breeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_bloodGroupId_fkey" FOREIGN KEY ("bloodGroupId") REFERENCES "blood_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_relationship" ADD CONSTRAINT "animal_relationship_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_relationship" ADD CONSTRAINT "animal_relationship_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_relationship" ADD CONSTRAINT "animal_relationship_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_associations" ADD CONSTRAINT "group_associations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_associations" ADD CONSTRAINT "group_associations_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_associations" ADD CONSTRAINT "group_associations_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_associations" ADD CONSTRAINT "merchant_associations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_associations" ADD CONSTRAINT "merchant_associations_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_associations" ADD CONSTRAINT "merchant_associations_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_ledgers" ADD CONSTRAINT "stock_ledgers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_ledgers" ADD CONSTRAINT "stock_ledgers_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_ledgers" ADD CONSTRAINT "stock_ledgers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_overrides" ADD CONSTRAINT "service_overrides_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_overrides" ADD CONSTRAINT "service_overrides_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BreedToService" ADD CONSTRAINT "_BreedToService_A_fkey" FOREIGN KEY ("A") REFERENCES "breeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BreedToService" ADD CONSTRAINT "_BreedToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergenToAnimal" ADD CONSTRAINT "_AllergenToAnimal_A_fkey" FOREIGN KEY ("A") REFERENCES "allergens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergenToAnimal" ADD CONSTRAINT "_AllergenToAnimal_B_fkey" FOREIGN KEY ("B") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToTag" ADD CONSTRAINT "_CustomerToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToTag" ADD CONSTRAINT "_CustomerToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToTag" ADD CONSTRAINT "_AnimalToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToTag" ADD CONSTRAINT "_AnimalToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToService" ADD CONSTRAINT "_GroupToService_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToService" ADD CONSTRAINT "_GroupToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MerchantToService" ADD CONSTRAINT "_MerchantToService_A_fkey" FOREIGN KEY ("A") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MerchantToService" ADD CONSTRAINT "_MerchantToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToService" ADD CONSTRAINT "_FacilityToService_A_fkey" FOREIGN KEY ("A") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToService" ADD CONSTRAINT "_FacilityToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTag" ADD CONSTRAINT "_ServiceToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTag" ADD CONSTRAINT "_ServiceToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToSpecies" ADD CONSTRAINT "_ServiceToSpecies_A_fkey" FOREIGN KEY ("A") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToSpecies" ADD CONSTRAINT "_ServiceToSpecies_B_fkey" FOREIGN KEY ("B") REFERENCES "species"("id") ON DELETE CASCADE ON UPDATE CASCADE;
