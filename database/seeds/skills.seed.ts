/**
 * skills.seed.ts — Seed Data for Skill Categories and Skills
 *
 * NESTED SEEDING PATTERN:
 *   Skills belong to categories (foreign key relationship).
 *   We must create the CATEGORY first, then the skills that reference it.
 *   Order matters: you can't insert a skill with a category_id that
 *   doesn't exist yet — the foreign key constraint would reject it.
 *
 *   We use Prisma's nested create: create the category and all its
 *   skills in ONE operation using the `skills: { create: [...] }` syntax.
 *   Prisma handles the order internally.
 *
 * UPSERT STRATEGY FOR NESTED DATA:
 *   upsert on the category level, then manually upsert each skill.
 *   We can't easily upsert deeply nested relations in one Prisma call,
 *   so we split it: upsert category, then upsert each skill individually.
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export async function seedSkills() {
  console.log('   Seeding skill categories and skills...')

  const categories = [
    {
      id: 'cat_frontend',
      name: 'Frontend',
      order: 1,
      skills: [
        { id: 'skill_react',    name: 'React / Next.js', percentage: 92, order: 1 },
        { id: 'skill_ts',       name: 'TypeScript',       percentage: 90, order: 2 },
        { id: 'skill_tailwind', name: 'Tailwind CSS',     percentage: 88, order: 3 },
        { id: 'skill_figma',    name: 'Figma → Code',     percentage: 82, order: 4 },
      ],
    },
    {
      id: 'cat_backend',
      name: 'Backend',
      order: 2,
      skills: [
        { id: 'skill_node',    name: 'Node.js / Express', percentage: 88, order: 1 },
        { id: 'skill_pg',      name: 'PostgreSQL',         percentage: 85, order: 2 },
        { id: 'skill_api',     name: 'REST / GraphQL',     percentage: 90, order: 3 },
        { id: 'skill_docker',  name: 'Docker / AWS',       percentage: 78, order: 4 },
      ],
    },
    {
      id: 'cat_pm',
      name: 'Project Management',
      order: 3,
      skills: [
        { id: 'skill_agile',  name: 'Agile / Scrum',    percentage: 90, order: 1 },
        { id: 'skill_risk',   name: 'Risk Management',  percentage: 82, order: 2 },
        { id: 'skill_gantt',  name: 'Gantt & Roadmaps', percentage: 85, order: 3 },
        { id: 'skill_stake',  name: 'Stakeholder Comms',percentage: 88, order: 4 },
      ],
    },
    {
      id: 'cat_tools',
      name: 'Tools & Standards',
      order: 4,
      skills: [
        { id: 'skill_gdpr',   name: 'GDPR Compliance',  percentage: 80, order: 1 },
        { id: 'skill_wcag',   name: 'WCAG Accessibility',percentage: 80, order: 2 },
        { id: 'skill_cicd',   name: 'CI/CD Pipelines',  percentage: 82, order: 3 },
        { id: 'skill_git',    name: 'Git / GitHub',      percentage: 95, order: 4 },
      ],
    },
  ]

  for (const cat of categories) {
    const { skills, ...categoryData } = cat

    // Step 1: Upsert the category
    await db.skillCategory.upsert({
      where: { id: categoryData.id },
      update: { name: categoryData.name, order: categoryData.order },
      create: categoryData,
    })
    console.log(`    ✓ Category: ${categoryData.name}`)

    // Step 2: Upsert each skill in the category
    for (const skill of skills) {
      await db.skill.upsert({
        where: { id: skill.id },
        update: {
          name: skill.name,
          percentage: skill.percentage,
          order: skill.order,
          // categoryId is set on create; we don't need to update it
          // since skills don't move between categories
        },
        create: {
          ...skill,
          categoryId: categoryData.id, // Link to the parent category
        },
      })
      console.log(`      ✓ ${skill.name} (${skill.percentage}%)`)
    }
  }
}
