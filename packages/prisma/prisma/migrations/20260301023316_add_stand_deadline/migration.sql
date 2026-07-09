/*
  Warnings:

  - Added the required column `standDeadline` to the `election` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "election" ADD COLUMN     "standDeadline" TIMESTAMP(3) NOT NULL;
