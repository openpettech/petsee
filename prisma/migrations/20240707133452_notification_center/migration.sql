-- CreateEnum
CREATE TYPE "NotificationModel" AS ENUM ('CUSTOMER', 'GROUP', 'MERCHANT', 'FACILITY', 'PERSON');

-- AlterEnum
ALTER TYPE "CustomFieldModel" ADD VALUE 'NOTIFICATION_CENTER';

-- CreateTable
CREATE TABLE "notification_centers" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "objectId" TEXT NOT NULL,
    "model" "NotificationModel" NOT NULL,
    "sms" BOOLEAN NOT NULL,
    "email" BOOLEAN NOT NULL,
    "mobilePush" BOOLEAN NOT NULL,
    "webPush" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" JSONB,
    "metadata" JSONB,

    CONSTRAINT "notification_centers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification_centers" ADD CONSTRAINT "notification_centers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
