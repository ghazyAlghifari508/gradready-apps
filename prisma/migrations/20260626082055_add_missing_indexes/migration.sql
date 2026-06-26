-- Add missing indexes and unique constraints
-- Audit: all FK columns and high-frequency filter columns that were full-scanning

-- Account: better-auth requires unique (providerId, accountId) to prevent duplicate OAuth rows
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_providerId_accountId_key" UNIQUE ("providerId", "accountId");

-- CvRecord: (userId, isLatest) — used by cv/latest findFirst query (was full table scan per user)
CREATE INDEX "cv_records_userId_isLatest_idx" ON "cv_records"("userId", "isLatest");

-- CvScoreHistory: FK columns unindexed
CREATE INDEX "cv_score_history_userId_idx" ON "cv_score_history"("userId");
CREATE INDEX "cv_score_history_cvRecordId_idx" ON "cv_score_history"("cvRecordId");

-- SkillGap: FK + compound filter column
CREATE INDEX "skill_gaps_userId_jobRoleId_idx" ON "skill_gaps"("userId", "jobRoleId");
CREATE INDEX "skill_gaps_cvRecordId_idx" ON "skill_gaps"("cvRecordId");

-- LearningResource: skillId FK unindexed
CREATE INDEX "learning_resources_skillId_idx" ON "learning_resources"("skillId");

-- SavedJob: (userId, savedAt) — ORDER BY savedAt DESC filter
CREATE INDEX "saved_jobs_userId_savedAt_idx" ON "saved_jobs"("userId", "savedAt");

-- ReadinessBadge: prevent duplicate badge per user+role+type; index userId for lookups
ALTER TABLE "readiness_badges" ADD CONSTRAINT "readiness_badges_userId_jobRoleId_badgeType_key" UNIQUE ("userId", "jobRoleId", "badgeType");
CREATE INDEX "readiness_badges_userId_idx" ON "readiness_badges"("userId");

-- GeneratedDoc: (userId, docType) for history filter; (userId, createdAt) for ordering
CREATE INDEX "generated_docs_userId_docType_idx" ON "generated_docs"("userId", "docType");
CREATE INDEX "generated_docs_userId_createdAt_idx" ON "generated_docs"("userId", "createdAt");

-- Article: (published, publishedAt) for public listing; authorId FK
CREATE INDEX "articles_published_publishedAt_idx" ON "articles"("published", "publishedAt");
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");
