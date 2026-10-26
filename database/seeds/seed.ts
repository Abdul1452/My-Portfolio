/**
 * seed.ts — Main Seed Runner
 *
 * WHAT THIS FILE DOES:
 *   Orchestrates all seed files in the correct order.
 *   Run with: pnpm db:seed (from backend/)
 *
 * WHY ORDER MATTERS:
 *   1. Skills first — no foreign key dependencies
 *   2. Projects — no dependencies on skills or contacts
 *   3. PM Projects — no dependencies
 *
 *   (Contacts are never seeded — they come from real form submissions)
 *
 * THE FINALLY BLOCK:
 *   db.$disconnect() MUST run whether seeding succeeds or fails.
 *   If we don't disconnect, the process hangs forever waiting
 *   for the connection pool to close.
 *   finally{} guarantees it always runs.
 */

import { PrismaClient } from '@prisma/client'
import { seedProjects, seedPMProjects } from './projects.seed'
import { seedSkills }                   from './skills.seed'

const db = new PrismaClient()

async function main() {
  console.log('\n🌱 Starting database seed...\n')

  await seedSkills()
  await seedProjects()
  await seedPMProjects()

  console.log('\n✅ Database seeded successfully!\n')
}

// Run main, handle errors, always disconnect
main()
  .catch(error => {
    console.error('\n❌ Seeding failed:\n', error)
    process.exit(1)
  })
  .finally(async () => {
    // Disconnect Prisma cleanly whether seed succeeded or failed
    await db.$disconnect()
  })
