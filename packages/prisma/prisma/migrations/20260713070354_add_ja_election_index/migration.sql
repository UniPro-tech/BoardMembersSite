-- Create Extention
CREATE EXTENSION IF NOT EXISTS pg_bigm;

-- DropIndex
DROP INDEX "election_name_idx";

-- CreateIndex
CREATE INDEX "election_description_idx" ON "election" USING GIN ("description" gin_bigm_ops);

-- CreateIndex
CREATE INDEX "election_name_idx" ON "election" USING GIN ("name" gin_bigm_ops);