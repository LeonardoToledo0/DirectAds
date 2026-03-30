-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN "microsoft_account_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_microsoft_account_id_key" ON "public"."users"("microsoft_account_id");
