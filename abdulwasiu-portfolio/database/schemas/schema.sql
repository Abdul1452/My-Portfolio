-- ============================================================
-- schema.sql — Combined Canonical SQL Schema
-- ============================================================
--
-- PURPOSE:
--   This file combines all migrations into a single SQL file.
--   It is used by Docker's postgres image on first startup:
--   mounted as /docker-entrypoint-initdb.d/schema.sql
--   Docker runs it automatically to initialize a fresh database.
--
-- NOTE:
--   In development and production, use Prisma migrations (prisma migrate dev).
--   This file is ONLY for Docker's cold-start initialization.
--   Keep it in sync with the individual migration files.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id           TEXT        PRIMARY KEY,
  slug         TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  tag          TEXT        NOT NULL,
  description  TEXT        NOT NULL,
  year         TEXT        NOT NULL,
  category     TEXT        NOT NULL DEFAULT 'engineering'
                           CHECK (category IN ('engineering', 'pm')),
  link_label   TEXT        NOT NULL,
  link_url     TEXT,
  image_url    TEXT,
  featured     BOOLEAN     NOT NULL DEFAULT FALSE,
  "order"      INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug     ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);
CREATE INDEX IF NOT EXISTS idx_projects_order    ON projects ("order");

-- PM Projects
CREATE TABLE IF NOT EXISTS pm_projects (
  id           TEXT        PRIMARY KEY,
  slug         TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  tag          TEXT        NOT NULL,
  description  TEXT        NOT NULL,
  icon         TEXT        NOT NULL DEFAULT '📋',
  year         TEXT        NOT NULL,
  link_label   TEXT        NOT NULL,
  link_url     TEXT,
  "order"      INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pm_projects_slug  ON pm_projects (slug);
CREATE INDEX IF NOT EXISTS idx_pm_projects_order ON pm_projects ("order");

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      CITEXT      NOT NULL,
  subject    TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_read       ON contacts (read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email      ON contacts (email);

-- Skill Categories
CREATE TABLE IF NOT EXISTS skill_categories (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL UNIQUE,
  "order"    INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories ("order");

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL,
  percentage  INTEGER     NOT NULL CHECK (percentage BETWEEN 0 AND 100),
  category_id TEXT        NOT NULL
              REFERENCES skill_categories(id)
              ON DELETE CASCADE,
  "order"     INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills (category_id);
CREATE INDEX IF NOT EXISTS idx_skills_order       ON skills ("order");
