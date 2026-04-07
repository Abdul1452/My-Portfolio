/**
 * logger.ts — Winston Logger Setup
 *
 * WHAT THIS FILE DOES:
 *   Creates a logger that writes structured log messages to:
 *     1. The console (always, coloured in development)
 *     2. A log file for errors (logs/error.log)
 *     3. A log file for all messages (logs/combined.log)
 *
 * WHY NOT JUST console.log?
 *   console.log is fine for quick debugging, but in a real app you need:
 *     - Log LEVELS (debug, info, warn, error) so you can filter noise
 *     - Timestamps on every line so you know WHEN something happened
 *     - File output so you can inspect logs after a crash
 *     - Structured JSON so log-monitoring tools (Datadog, etc.) can parse them
 *   Winston gives you all of this.
 *
 * LOG LEVELS (lowest → highest severity):
 *   debug → info → warn → error
 *   Setting level to 'info' means debug messages are hidden.
 *   Setting level to 'error' means only errors are shown.
 *
 * USAGE (in other files):
 *   import { logger } from '@config/logger'
 *   logger.info('Server started on port 4000')
 *   logger.warn('Missing optional env var SMTP_USER')
 *   logger.error('Database connection failed', { error: err.message })
 */

import winston from 'winston'
import path from 'path'
import { env } from './env'

// ─── 1. Define the log format ─────────────────────────────────────────────────
//
// winston.format.combine() chains multiple formatters together.
// Each one transforms the log entry before it's written.

const developmentFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  // colorize() adds ANSI colour codes: green for info, yellow for warn, red for error
  // This only works in terminals — log files should not have colour codes.

  winston.format.timestamp({ format: 'HH:mm:ss' }),
  // timestamp() adds a { timestamp } field to every log entry.
  // In dev we use short time (HH:mm:ss); in production we'd use full ISO.

  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // printf() gives you full control over the final string output.
    // meta contains any extra data you passed: logger.info('msg', { userId: 1 })
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ''
    return `${timestamp} [${level}]: ${message}${metaStr}`
    // Example output: 12:34:56 [info]: Server started on port 4000
  })
)

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Include stack traces for errors
  winston.format.json()
  // json() outputs structured JSON — easy for log monitoring tools to parse:
  // {"level":"info","message":"Server started","timestamp":"2025-04-03T12:00:00.000Z"}
)

// ─── 2. Define where logs go (transports) ────────────────────────────────────
//
// A "transport" is a destination for log messages.
// We use three:
//   1. Console — always active
//   2. Error file — only error-level messages
//   3. Combined file — all messages

const logsDir = path.join(process.cwd(), 'logs')

const transports: winston.transport[] = [
  // Console transport — shows in your terminal while the server runs
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? developmentFormat : productionFormat,
  }),

  // File transport — only errors (useful for post-mortem debugging)
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',       // Only write messages at 'error' level
    format: productionFormat,
    maxsize: 5 * 1024 * 1024, // 5MB max per file
    maxFiles: 5,              // Keep last 5 rotated files
  }),

  // File transport — everything (info + warn + error)
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: productionFormat,
    maxsize: 10 * 1024 * 1024, // 10MB max per file
    maxFiles: 5,
  }),
]

// ─── 3. Create the logger ─────────────────────────────────────────────────────

export const logger = winston.createLogger({
  // Only log messages at this level and above.
  // 'debug' in development shows everything.
  // 'info' in production hides debug messages.
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',

  // Default metadata added to every log entry
  defaultMeta: { service: 'portfolio-api' },

  transports,

  // Don't crash the app if logger itself throws
  exitOnError: false,
})

// ─── 4. Export a stream for Morgan HTTP logging ───────────────────────────────
//
// Morgan (HTTP request logger middleware) can write to any stream.
// We point it at our Winston logger so all logs go to the same place.
// We use 'http' level — between debug and info — for request logs.

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim())
    // .trim() removes the trailing newline Morgan adds
  },
}
