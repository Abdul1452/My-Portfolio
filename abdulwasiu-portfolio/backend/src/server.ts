/**
 * server.ts — Server Bootstrap
 *
 * WHAT THIS FILE DOES:
 *   1. Connects Prisma to the database (tests the connection)
 *   2. Optionally verifies the SMTP email connection
 *   3. Starts Express listening on the configured PORT
 *   4. Sets up graceful shutdown handlers
 *
 * WHY CONNECT DATABASE BEFORE LISTENING?
 *   If the database connection fails and Express is already listening,
 *   every incoming request would hit a broken server.
 *   We confirm the DB is ready FIRST, then open the HTTP port.
 *   If DB connection fails → we log the error and exit with code 1.
 *
 * GRACEFUL SHUTDOWN:
 *   When the server receives a SIGTERM or SIGINT signal (e.g., Ctrl+C,
 *   or the hosting platform restarting the container), we should:
 *   1. Stop accepting new requests
 *   2. Wait for in-flight requests to finish
 *   3. Close the database connection cleanly
 *   This prevents data corruption and dropped requests during deployments.
 */

import { db }           from '@config/database'
import { env }          from '@config/env'
import { logger }       from '@config/logger'
import { EmailService } from '@services/email.service'
import app              from './app'

// ─── Startup function ─────────────────────────────────────────────────────────
//
// Using an async IIFE (Immediately Invoked Function Expression):
//   (async () => { ... })()
//
// This pattern lets us use `await` at the top level, which Node.js
// supports in ESM modules but not in CommonJS modules by default.
// Wrapping in an async function is the safe approach.

async function startServer(): Promise<void> {
  try {
    // ── Step 1: Connect to the database ────────────────────────────────────────
    //
    // db.$connect() opens the Prisma connection pool to PostgreSQL.
    // If DATABASE_URL is wrong or the DB is down, this throws an error
    // and we exit before starting to listen for HTTP requests.
    logger.info('Connecting to database...')
    await db.$connect()
    logger.info('✅ Database connected')

    // ── Step 2: Verify email connection (non-blocking) ──────────────────────────
    //
    // We check SMTP but don't EXIT if it fails — the app still works
    // without email (contacts are saved to DB; email is a nice-to-have).
    // EmailService.verifyConnection() logs a warning internally if it fails.
    if (env.SMTP_USER) {
      await EmailService.verifyConnection()
    } else {
      logger.warn('SMTP_USER not set — email notifications will be skipped')
    }

    // ── Step 3: Start HTTP server ───────────────────────────────────────────────
    //
    // app.listen(port, callback) binds the Express app to a TCP port
    // and starts accepting incoming connections.
    // The callback runs once binding is complete.
    //
    // We store the return value (server) so we can close it gracefully.
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode`)
      logger.info(`📡 Listening on http://localhost:${env.PORT}`)
      logger.info(`🔗 API available at http://localhost:${env.PORT}${env.API_PREFIX}`)
    })

    // ── Step 4: Graceful shutdown handlers ─────────────────────────────────────
    //
    // SIGTERM: sent by hosting platforms (Railway, Render, Docker) when
    //          they want to stop/restart the container.
    // SIGINT:  sent when you press Ctrl+C in the terminal.
    //
    // Without these handlers, the process exits immediately, potentially:
    //   - Dropping in-flight database transactions
    //   - Leaving connections in a broken state
    //   - Losing request data

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — starting graceful shutdown...`)

      // Stop accepting new HTTP connections
      server.close(async () => {
        logger.info('HTTP server closed — no new connections accepted')

        // Disconnect Prisma cleanly (flushes pending queries)
        await db.$disconnect()
        logger.info('Database connection closed')

        logger.info('Graceful shutdown complete. Goodbye! 👋')
        process.exit(0) // Exit with code 0 = success
      })

      // Safety net: if shutdown takes more than 10 seconds, force-exit
      // This prevents the process from hanging forever if something is stuck
      setTimeout(() => {
        logger.error('Graceful shutdown timed out — forcing exit')
        process.exit(1)
      }, 10_000)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT',  () => shutdown('SIGINT'))

    // ── Step 5: Unhandled promise rejection safety net ─────────────────────────
    //
    // If a Promise rejects and nothing catches it, Node.js used to silently
    // ignore it (very dangerous). Now it warns, and future versions will crash.
    // We log and exit so bugs aren't silently swallowed.

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Promise Rejection:', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      })
      // In production, exit and let the host restart the service cleanly
      if (env.NODE_ENV === 'production') {
        process.exit(1)
      }
    })

  } catch (error) {
    // If database connection or any startup step fails, log and exit
    logger.error('Failed to start server:', {
      error: error instanceof Error ? error.message : String(error),
    })
    await db.$disconnect()
    process.exit(1)
  }
}

export { startServer }
