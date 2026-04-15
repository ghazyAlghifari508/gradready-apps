-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('RED', 'YELLOW', 'GREEN');

-- CreateEnum
CREATE TYPE "DemandLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('HIGH', 'MED', 'LOW');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('MOTIVATION', 'COVER', 'LINKEDIN', 'PORTFOLIO', 'SELF_INTRO', 'CV');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('READY_75', 'READY_90', 'FULLY_READY');

-- CreateEnum
CREATE TYPE "QuizLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetJobId" TEXT,
    "university" TEXT,
    "graduationYear" INTEGER,
    "bio" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "phone" TEXT,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "avgSalaryMin" INTEGER,
    "avgSalaryMax" INTEGER,
    "demandLevel" "DemandLevel" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_role_skills" (
    "id" TEXT NOT NULL,
    "jobRoleId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "priorityLevel" "PriorityLevel" NOT NULL DEFAULT 'MED',

    CONSTRAINT "job_role_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileUrl" TEXT,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER,
    "parsedSkills" JSONB,
    "feedbackJson" JSONB,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_score_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvRecordId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_score_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_gaps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvRecordId" TEXT NOT NULL,
    "jobRoleId" TEXT NOT NULL,
    "gapDetailJson" JSONB,
    "readinessPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_gaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skill_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "status" "SkillStatus" NOT NULL DEFAULT 'RED',
    "quizScore" INTEGER,
    "quizLevel" "QuizLevel",
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skill_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_resources" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "durationWeeks" DOUBLE PRECISION,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "roadmap_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_docs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "docType" "DocType" NOT NULL,
    "contentText" TEXT NOT NULL,
    "inputJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jobDescText" TEXT,
    "fitScore" INTEGER,
    "status" "JobStatus" NOT NULL DEFAULT 'SAVED',
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readiness_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobRoleId" TEXT NOT NULL,
    "badgeType" "BadgeType" NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "readiness_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "optionsJson" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "job_roles_name_key" ON "job_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_role_skills_jobRoleId_skillId_key" ON "job_role_skills"("jobRoleId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_progress_userId_skillId_key" ON "user_skill_progress"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_progress_userId_resourceId_key" ON "roadmap_progress"("userId", "resourceId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_targetJobId_fkey" FOREIGN KEY ("targetJobId") REFERENCES "job_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_role_skills" ADD CONSTRAINT "job_role_skills_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_role_skills" ADD CONSTRAINT "job_role_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_records" ADD CONSTRAINT "cv_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_score_history" ADD CONSTRAINT "cv_score_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_score_history" ADD CONSTRAINT "cv_score_history_cvRecordId_fkey" FOREIGN KEY ("cvRecordId") REFERENCES "cv_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_cvRecordId_fkey" FOREIGN KEY ("cvRecordId") REFERENCES "cv_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "learning_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_docs" ADD CONSTRAINT "generated_docs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readiness_badges" ADD CONSTRAINT "readiness_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readiness_badges" ADD CONSTRAINT "readiness_badges_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
