/**
 * fetch-github-activity.mjs — Snapshot the GitHub contribution calendar
 *
 * WHAT THIS DOES:
 *   Asks GitHub's GraphQL API for the last year of contributions for one
 *   user and writes them to src/data/github-activity.json. The homepage's
 *   "GitHub activity" grid reads that file.
 *
 * WHY A SNAPSHOT INSTEAD OF FETCHING IN THE BROWSER?
 *   The contribution calendar is only available through GraphQL, and GraphQL
 *   always needs a token. A token in browser code is a token anyone can copy,
 *   so we fetch here, at development time, and ship plain JSON instead.
 *   Re-run it whenever you want the grid to catch up:
 *
 *     pnpm --filter frontend github:snapshot
 *
 * WHERE THE TOKEN COMES FROM (first one found wins):
 *   1. GITHUB_TOKEN environment variable
 *   2. `gh auth token` (if you're logged in with the GitHub CLI)
 */

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOGIN = process.argv[2] ?? 'Abdul1452'
const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github-activity.json')

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim()
  } catch {
    throw new Error('No token: set GITHUB_TOKEN or log in with `gh auth login`.')
  }
}

const query = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
})
const body = await res.json()
if (!res.ok || body.errors) {
  throw new Error(`GitHub API error: ${JSON.stringify(body.errors ?? body)}`)
}

const calendar = body.data.user.contributionsCollection.contributionCalendar
const days = calendar.weeks
  .flatMap(week => week.contributionDays)
  .map(day => ({ date: day.date, count: day.contributionCount }))

// Longest run of consecutive days with at least one contribution.
let longestStreak = 0
let run = 0
for (const day of days) {
  run = day.count > 0 ? run + 1 : 0
  longestStreak = Math.max(longestStreak, run)
}

const snapshot = {
  login: LOGIN,
  fetchedAt: new Date().toISOString(),
  total: calendar.totalContributions,
  longestStreak,
  days,
}

writeFileSync(OUT_FILE, JSON.stringify(snapshot, null, 2) + '\n')
console.log(`Saved ${days.length} days (${snapshot.total} contributions, longest streak ${longestStreak}) to ${OUT_FILE}`)
