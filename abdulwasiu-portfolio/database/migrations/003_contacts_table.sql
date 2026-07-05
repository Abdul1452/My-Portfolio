-- ============================================================
-- 003_contacts_table.sql — Contact Submissions Table
-- ============================================================
--
-- This table is write-heavy (new rows on every contact form submission)
-- and read-only from the public API. Only an admin panel would read from it.
--
-- CITEXT:
--   We use the citext extension (enabled in 001) for the email column.
--   citext stores text in its original case but compares case-insensitively.
--   So 'Abdulwasiu@EXAMPLE.FI' and 'abdulwasiu@example.fi' are treated as equal
--   in WHERE clauses and UNIQUE constraints — exactly what you want for emails.

CREATE TABLE IF NOT EXISTS contacts (
  id         TEXT        PRIMARY KEY,

  name       TEXT        NOT NULL,
  -- We use CITEXT for email so "user@example.com" = "User@Example.COM"
  email      CITEXT      NOT NULL,
  subject    TEXT        NOT NULL,
  message    TEXT        NOT NULL,

  -- read: whether the portfolio owner has seen this message
  -- Useful for a future admin dashboard showing unread messages
  read       BOOLEAN     NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at: contact submissions are never edited
);

-- Index for filtering unread messages in an admin panel
CREATE INDEX IF NOT EXISTS idx_contacts_read       ON contacts (read);
-- Index for chronological sorting (newest first)
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);
-- Index for looking up contacts by email
CREATE INDEX IF NOT EXISTS idx_contacts_email      ON contacts (email);
