/**
 * express.d.ts — Express Request Type Augmentation
 *
 * WHAT IS "TYPE AUGMENTATION"?
 *   TypeScript's type system is open — you can add fields to existing types
 *   from third-party libraries using "declaration merging".
 *
 *   Express's Request type only has built-in fields: req.body, req.params, etc.
 *   We want to add our own field: req.validatedBody
 *
 *   req.validatedBody will hold the Zod-validated (and typed) request body
 *   after our validateRequest middleware runs.
 *
 * WHY NOT JUST USE req.body?
 *   req.body is typed as `any` in Express — TypeScript has no idea what's in it.
 *   req.validatedBody is typed properly, so you get autocomplete and type errors
 *   if you access a field that doesn't exist.
 *
 * HOW IT WORKS:
 *   We re-open the Express namespace and add our field.
 *   TypeScript merges this with Express's own type definitions.
 *   No import needed anywhere — it applies globally once TypeScript sees this file.
 */

// We must import something (even if empty) to make this a "module"
// rather than a "script" — required for declaration merging to work.
export {}

declare global {
  namespace Express {
    interface Request {
      // validatedBody holds the parsed + validated request body.
      // It's unknown by default and cast to the proper type in each controller.
      // Using unknown (not any) forces you to narrow the type before using it.
      validatedBody?: unknown
    }
  }
}