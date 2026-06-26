CREATE UNIQUE INDEX cv_records_user_latest_unique ON cv_records ("userId") WHERE "isLatest" = true;
