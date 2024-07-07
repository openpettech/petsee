/*
  Warnings:

  - Added the required column `providerId` to the `sms_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sms_logs" ADD COLUMN     "providerId" TEXT NOT NULL;
