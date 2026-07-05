-- ============================================================
-- 004_skills_table.sql — Skill Categories & Skills Tables
-- ============================================================
--
-- This introduces a FOREIGN KEY — a key concept in relational databases.
--
-- RELATIONAL DATABASE DESIGN:
--   Instead of storing everything in one big table:
--     | skill_name     | category  | percentage |
--     | React/Next.js  | Frontend  | 92         |
--     | TypeScript     | Frontend  | 90         |
--     | Node.js        | Backend   | 88         |
--
--   We split into TWO tables to avoid repeating "Frontend" and "Backend":
--
--   skill_categories:                    skills:
--     | id | name     | order |            | id | name          | pct | category_id |
--     | c1 | Frontend | 1     |            | s1 | React/Next.js | 92  | c1          |
--     | c2 | Backend  | 2     |            | s2 | TypeScript    | 90  | c1          |
--                                          | s3 | Node.js       | 88  | c2          |
--
-- FOREIGN KEY:
--   skills.category_id references skill_categories.id
--   This means: every skill MUST belong to an existing category.
--   If you try to insert a skill with a category_id that doesn't exist,
--   PostgreSQL rejects it with a foreign key constraint error.
--   This maintains "referential integrity" — no orphaned skills.
--
-- ON DELETE CASCADE:
--   If a skill_category row is deleted, automatically delete all
--   skills that belong to it. Keeps data clean.

CREATE TABLE IF NOT EXISTS skill_categories (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL UNIQUE,   -- "Frontend", "Backend", "Project Management"
  "order"    INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories ("order");


CREATE TABLE IF NOT EXISTS skills (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL,         -- "React / Next.js"
  percentage  INTEGER     NOT NULL          -- 0-100 proficiency level
              CHECK (percentage BETWEEN 0 AND 100),
  -- FOREIGN KEY: links this skill to its category
  category_id TEXT        NOT NULL
              REFERENCES skill_categories(id)
              ON DELETE CASCADE,
  -- ON DELETE CASCADE: if the category is deleted, so are its skills
  "order"     INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fetching all skills in a category (most common query)
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills (category_id);
CREATE INDEX IF NOT EXISTS idx_skills_order       ON skills ("order");
