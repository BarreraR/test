CREATE TABLE "language" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "total_score" SMALLINT DEFAULT 0,
  "person_id" INTEGER REFERENCES "person"(id)
    ON DELETE CASCADE NOT NULL
);
