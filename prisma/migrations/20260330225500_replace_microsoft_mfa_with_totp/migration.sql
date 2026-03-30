-- DropIndex
DROP INDEX IF EXISTS "users_microsoft_account_id_key";

-- AlterTable
ALTER TABLE "public"."users"
DROP COLUMN IF EXISTS "microsoft_account_id",
ADD COLUMN "mfa_secret" TEXT,
ADD COLUMN "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mfa_confirmed_at" TIMESTAMP(3);
