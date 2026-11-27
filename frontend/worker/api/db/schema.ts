/**
 * schema.ts — The API's database tables (Cloudflare D1, i.e. SQLite)
 *
 * SINGLE SOURCE OF TRUTH:
 *   Same idea as backend/prisma/schema.prisma, now with Drizzle. To change
 *   a table:
 *     1. Edit it here
 *     2. `pnpm db:generate` — Drizzle diffs this file and writes a new SQL
 *        migration into ./migrations
 *     3. `pnpm db:migrate:local` to try it, `pnpm db:migrate:remote` for prod
 *     4. Commit both the schema change and the migration
 *
 * DIFFERENCES FROM THE POSTGRES VERSION:
 *   - Booleans are 0/1 integers in SQLite; Drizzle maps them to true/false.
 *   - Timestamps are ISO-8601 text ("2026-11-26T12:00:00.000Z"), which sorts
 *     correctly as text and needs no conversion in JSON.
 *   - No citext: the API lower-cases e-mail addresses before saving instead.
 *   - Ids are random UUIDs (crypto.randomUUID) instead of cuid().
 */

import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID())
const createdAt = () => text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
const updatedAt = () =>
  text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .$onUpdate(() => new Date().toISOString())

export const projects = sqliteTable(
  'projects',
  {
    id: id(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    tag: text('tag').notNull(),
    description: text('description').notNull(),
    year: text('year').notNull(),
    category: text('category', { enum: ['engineering', 'pm'] }).notNull().default('engineering'),
    linkLabel: text('link_label').notNull(),
    linkUrl: text('link_url'),
    imageUrl: text('image_url'),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    order: integer('order').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [
    index('idx_projects_category').on(table.category),
    index('idx_projects_featured').on(table.featured),
    index('idx_projects_order').on(table.order),
    check('projects_category_check', sql`${table.category} IN ('engineering', 'pm')`),
  ],
)

export const pmProjects = sqliteTable(
  'pm_projects',
  {
    id: id(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    tag: text('tag').notNull(),
    description: text('description').notNull(),
    icon: text('icon').notNull(),
    year: text('year').notNull(),
    linkLabel: text('link_label').notNull(),
    linkUrl: text('link_url'),
    order: integer('order').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [index('idx_pm_projects_order').on(table.order)],
)

export const skillCategories = sqliteTable(
  'skill_categories',
  {
    id: id(),
    name: text('name').notNull().unique(),
    order: integer('order').notNull().default(0),
    createdAt: createdAt(),
  },
  table => [index('idx_skill_categories_order').on(table.order)],
)

export const skills = sqliteTable(
  'skills',
  {
    id: id(),
    name: text('name').notNull(),
    percentage: integer('percentage').notNull(),
    categoryId: text('category_id')
      .notNull()
      .references(() => skillCategories.id, { onDelete: 'cascade' }),
    order: integer('order').notNull().default(0),
    createdAt: createdAt(),
  },
  table => [
    index('idx_skills_category_id').on(table.categoryId),
    index('idx_skills_order').on(table.order),
    check('skills_percentage_check', sql`${table.percentage} BETWEEN 0 AND 100`),
  ],
)

export const contacts = sqliteTable(
  'contacts',
  {
    id: id(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    read: integer('read', { mode: 'boolean' }).notNull().default(false),
    createdAt: createdAt(),
  },
  table => [
    index('idx_contacts_read').on(table.read),
    index('idx_contacts_created_at').on(table.createdAt),
    index('idx_contacts_email').on(table.email),
  ],
)
