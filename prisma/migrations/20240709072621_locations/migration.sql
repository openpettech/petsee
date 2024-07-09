-- AlterEnum
ALTER TYPE "CustomFieldModel" ADD VALUE 'LOCATION';

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "street" TEXT,
    "houseNumber" TEXT,
    "apartment" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
