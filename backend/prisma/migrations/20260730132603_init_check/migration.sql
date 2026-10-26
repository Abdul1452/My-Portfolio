-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_category_id_fkey";

-- AlterTable
ALTER TABLE "pm_projects" ALTER COLUMN "icon" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "skill_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
