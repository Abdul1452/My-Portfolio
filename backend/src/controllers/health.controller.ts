/**
 * health.controller.ts — Health Check Endpoint
 *
 * WHAT IS A HEALTH CHECK?
 *   A simple endpoint that returns "I'm alive and working".
 *   Used by:
 *     - Docker / Kubernetes to know if the container is healthy
 *     - Deployment platforms (Railway, Render) to know when to route traffic
 *     - Your own monitoring to alert you if the server goes down
 *     - Developers to quickly confirm the server is running
 *
 * GET /api/v1/health
 * → 200 { status: "ok", timestamp: "...", uptime: 123.4 }
 */

import type { Request, Response } from 'express'

export const HealthController = {
  check(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      // process.uptime() = seconds since Node.js process started
      // Useful for knowing "the server has been running for X seconds"
    })
  },
}
