UPDATE "users"
SET "role" = LOWER("role")
WHERE LOWER("role") IN ('admin', 'user');

ALTER TABLE "users"
ALTER COLUMN "role" TYPE VARCHAR(16);

ALTER TABLE "users"
ADD CONSTRAINT "users_role_check" CHECK ("role" IN ('user', 'admin'));
