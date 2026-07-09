/*
  Warnings:

  - A unique constraint covering the columns `[parentElectionId]` on the table `election` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "election" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "isRunoff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentElectionId" UUID;

-- AlterTable
ALTER TABLE "vote" ADD COLUMN     "isRunoff" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "election_parentElectionId_key" ON "election"("parentElectionId");

-- AddForeignKey
ALTER TABLE "election" ADD CONSTRAINT "election_parentElectionId_fkey" FOREIGN KEY ("parentElectionId") REFERENCES "election"("id") ON DELETE CASCADE ON UPDATE CASCADE;
