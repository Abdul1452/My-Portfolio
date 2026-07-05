-- ============================================================
-- 001_initial_schema.sql — Base Database Setup
-- ============================================================
--
-- WHAT IS THIS FILE?
--   The first migration. Runs once to set up the database
--   with any extensions or configurations needed before tables are created.
--
-- PostgreSQL EXTENSIONS:
--   PostgreSQL can be extended with add-on modules.
--   We enable two useful ones:
--
--   pgcrypto  → provides gen_random_uuid() for generating UUIDs
--               We use cuid() from Prisma instead, but having pgcrypto
--               available is a good practice.
--
--   citext    → case-insensitive text type.
--               Useful for email columns where you want
--               'ABDULWASIU@EXAMPLE.FI' = 'abdulwasiu@example.fi'
--               Without citext you'd need to always call LOWER() manually.
--
-- CREATE EXTENSION IF NOT EXISTS:
--   "IF NOT EXISTS" prevents errors if the extension is already enabled.
--   Safe to re-run.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
