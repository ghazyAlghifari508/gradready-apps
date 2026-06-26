DELETE FROM "quiz_questions" q
USING (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "skillId", "questionText"
            ORDER BY "id"
        ) AS row_number
    FROM "quiz_questions"
) duplicates
WHERE q."id" = duplicates."id"
  AND duplicates.row_number > 1;

CREATE UNIQUE INDEX "quiz_questions_skillId_questionText_key" ON "quiz_questions"("skillId", "questionText");
