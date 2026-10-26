/**
 * asyncHandler.ts — Async Route Handler Wrapper
 *
 * THE PROBLEM:
 *   In Express, if an async function throws an error and you don't catch it,
 *   the server hangs — the request never gets a response.
 *
 *   You'd normally wrap every controller in try/catch:
 *
 *     router.get('/projects', async (req, res, next) => {
 *       try {
 *         const projects = await projectService.getAll()
 *         res.json(projects)
 *       } catch (err) {
 *         next(err) // pass to error handler
 *       }
 *     })
 *
 *   With 30+ routes, that's a LOT of repeated try/catch boilerplate.
 *
 * THE SOLUTION:
 *   asyncHandler() wraps the async function and adds the try/catch automatically.
 *   Your controllers become clean, no boilerplate:
 *
 *     router.get('/projects', asyncHandler(async (req, res) => {
 *       const projects = await projectService.getAll()
 *       res.json(projects)
 *     }))
 *
 *   If projectService.getAll() throws, asyncHandler catches it and calls next(err),
 *   which triggers our global error handler middleware.
 *
 * HOW THE TYPE WORKS:
 *   RequestHandler is Express's type for (req, res, next) => void
 *   We return a new function that wraps the original in Promise.resolve().catch(next)
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve() wraps fn() in a promise even if it's not async.
    // .catch(next) forwards any rejected promise to Express's next(err).
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}