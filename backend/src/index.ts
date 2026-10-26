/**
 * index.ts — Application Entry Point
 *
 * WHAT THIS FILE DOES:
 *   The single entry point Node.js runs when you do `node dist/index.js`
 *   or `ts-node src/index.ts`.
 *
 * WHY SO SMALL?
 *   The entry point should do ONE thing: load environment variables
 *   and kick off the startup sequence.
 *
 *   All the real logic lives in:
 *     app.ts     → Express middleware and route setup
 *     server.ts  → Database connection and HTTP server startup
 *
 *   This pattern keeps the entry point trivially simple and makes
 *   the rest of the code easy to import in tests without side effects.
 *
 * dotenv.config() MUST run before anything else:
 *   It reads the .env file and populates process.env.
 *   If it runs AFTER config/env.ts imports, env.ts sees empty process.env
 *   and every variable fails validation.
 *
 *   Order of execution:
 *     1. dotenv.config()           ← populates process.env from .env file
 *     2. import { startServer }    ← config/env.ts reads process.env safely
 *     3. startServer()             ← connects DB, starts listening
 */

// Load .env file variables into process.env FIRST
// This must be the very first import/call in the entire application
import 'dotenv/config'

import { startServer } from './server'

// Call the async startup function.
// startServer() handles its own errors internally and calls process.exit(1)
// if anything goes wrong, so we don't need a .catch() here.
startServer()
