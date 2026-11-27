-- seed.sql — The portfolio's content for the D1 database
--
-- Same data as database/seeds/*.seed.ts (the Postgres seed), as plain SQL so
-- wrangler can run it:  pnpm db:seed:local  /  pnpm db:seed:remote
--
-- IDEMPOTENT: every row is an upsert (INSERT … ON CONFLICT DO UPDATE), and
-- rows that are no longer listed here are deleted, so running it again after
-- editing a description simply brings the database in line with this file.

-- ─── Engineering projects ──────────────────────────────────────────────────────

INSERT INTO projects (id, slug, title, tag, description, year, category, link_label, link_url, image_url, featured, "order") VALUES
  ('cuid_project_pets_transformer', 'pets-transformer', 'PETs Transformer', 'Python · pandas · scikit-learn · FastAPI · React · TypeScript · Docker',
   'Recognised as the best solution for the TrustED PETs Transformer challenge at Since AI Hackathon 2026 (team of five). A privacy release gate: it protects a dataset for a named recipient, checks that the recipient’s questions can still be answered, then attacks its own output; if any of 18 gate checks fails, nothing is released. Hospital scenario: privacy 1.00, usefulness 0.99, all 176,739 rows kept. Synthetic challenge data; not produced or endorsed by the TrustED consortium or the EU.',
   '2026', 'engineering', 'Repository', 'https://github.com/oluwatobimaxwell/pets-transformer', NULL, 1, 0),
  ('cuid_project_petosvahti', 'petosvahti', 'Petosvahti', 'Python · FastAPI · Kafka · scikit-learn · Docker',
   'Real-time fraud detection for Finnish payments. Kafka streams transactions, an Isolation Forest scores them, FastAPI returns approve / review / block with reason codes. Written against PSD3 and SEPA Instant, with charter, risk register, ADRs and an EU compliance folder.',
   '2026', 'engineering', 'Repository', 'https://github.com/Abdul1452/Fraud-Detector-PetosVahti-', NULL, 1, 1),
  ('cuid_project_slope_deflection', 'slope-deflection-calculator', 'Slope Deflection Calculator', 'Next.js 14 · TypeScript · Recharts',
   'Beam and rigid-frame analysis in the browser: fixed-end moments, joint equilibrium with sway, bending-moment and shear-force diagrams, support reactions.',
   '2026', 'engineering', 'Case study', 'https://github.com/Abdul1452/Slope-deflection-Calculator', NULL, 0, 2),
  ('cuid_project_serverless_quote', 'serverless-quote-api', 'Serverless Quote API', 'AWS SAM · Lambda · Python',
   'REST API plus a daily EventBridge job on AWS Lambda, deployed with SAM. Structured CloudWatch logging, pytest suite, GitHub Actions CI on every push.',
   '2025', 'engineering', 'Case study', 'https://github.com/Abdul1452/inspirational-quote-generator', NULL, 0, 3)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title, tag = excluded.tag, description = excluded.description, year = excluded.year,
  category = excluded.category, link_label = excluded.link_label, link_url = excluded.link_url,
  image_url = excluded.image_url, featured = excluded.featured, "order" = excluded."order",
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');

DELETE FROM projects WHERE slug NOT IN ('pets-transformer', 'petosvahti', 'slope-deflection-calculator', 'serverless-quote-api');

-- ─── PM projects ───────────────────────────────────────────────────────────────

INSERT INTO pm_projects (id, slug, title, tag, description, icon, year, link_label, link_url, "order") VALUES
  ('cuid_pm_001', 'pm-guidebook', 'Project Management Guidebook', 'PM · Course project · Team of 6',
   'A practical guidebook for software project teams, written by a team of six in our project management course at Turku UAS: Waterfall, Scrum and other Agile frameworks, WBS and Gantt charts, scope, risk, change and quality management, PM tools and certifications, with ready-to-use templates.',
   '📖', '2026', 'Read the PDF', '/files/docs/project-management-guidebook.pdf', 1)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title, tag = excluded.tag, description = excluded.description, icon = excluded.icon,
  year = excluded.year, link_label = excluded.link_label, link_url = excluded.link_url, "order" = excluded."order",
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');

DELETE FROM pm_projects WHERE slug NOT IN ('pm-guidebook');

-- ─── Skill categories and skills ───────────────────────────────────────────────

INSERT INTO skill_categories (id, name, "order") VALUES
  ('cat_frontend', 'Frontend', 1),
  ('cat_backend', 'Backend', 2),
  ('cat_pm', 'Project Management', 3),
  ('cat_tools', 'Tools & Standards', 4)
ON CONFLICT(id) DO UPDATE SET name = excluded.name, "order" = excluded."order";

INSERT INTO skills (id, name, percentage, category_id, "order") VALUES
  ('skill_react', 'React / Next.js', 92, 'cat_frontend', 1),
  ('skill_ts', 'TypeScript', 90, 'cat_frontend', 2),
  ('skill_tailwind', 'Tailwind CSS', 88, 'cat_frontend', 3),
  ('skill_figma', 'Figma → Code', 82, 'cat_frontend', 4),
  ('skill_node', 'Node.js / Express', 88, 'cat_backend', 1),
  ('skill_pg', 'PostgreSQL', 85, 'cat_backend', 2),
  ('skill_api', 'REST / GraphQL', 90, 'cat_backend', 3),
  ('skill_docker', 'Docker / AWS', 78, 'cat_backend', 4),
  ('skill_agile', 'Agile / Scrum', 90, 'cat_pm', 1),
  ('skill_risk', 'Risk Management', 82, 'cat_pm', 2),
  ('skill_gantt', 'Gantt & Roadmaps', 85, 'cat_pm', 3),
  ('skill_stake', 'Stakeholder Comms', 88, 'cat_pm', 4),
  ('skill_gdpr', 'GDPR Compliance', 80, 'cat_tools', 1),
  ('skill_wcag', 'WCAG Accessibility', 80, 'cat_tools', 2),
  ('skill_cicd', 'CI/CD Pipelines', 82, 'cat_tools', 3),
  ('skill_git', 'Git / GitHub', 95, 'cat_tools', 4)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name, percentage = excluded.percentage, category_id = excluded.category_id, "order" = excluded."order";

DELETE FROM skills WHERE id NOT IN (
  'skill_react', 'skill_ts', 'skill_tailwind', 'skill_figma', 'skill_node', 'skill_pg', 'skill_api', 'skill_docker',
  'skill_agile', 'skill_risk', 'skill_gantt', 'skill_stake', 'skill_gdpr', 'skill_wcag', 'skill_cicd', 'skill_git'
);
DELETE FROM skill_categories WHERE id NOT IN ('cat_frontend', 'cat_backend', 'cat_pm', 'cat_tools');
