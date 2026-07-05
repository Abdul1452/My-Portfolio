/**
 * contact.controller.ts — HTTP Handler for Contact Form
 *
 * The validateRequest(contactSchema) middleware runs BEFORE this handler.
 * By the time submit() runs, we know req.validatedBody is valid.
 *
 * We cast req.validatedBody to ContactSchemaInput — safe because
 * validateRequest already confirmed the shape.
 */

import type { Request, Response } from 'express'
import { ContactService }         from '@services/contact.service'
import { sendSuccess }            from '@utils/response'
import { asyncHandler }           from '@utils/asyncHandler'
import type { ContactSchemaInput } from '@utils/validators'

export const ContactController = {
  /**
   * submit — POST /api/v1/contact
   * Expects validateRequest(contactSchema) middleware to have run first.
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    // req.validatedBody was set by validateRequest middleware
    // We cast it because we know the shape — Zod already confirmed it
    const input = req.validatedBody as ContactSchemaInput

    const contact = await ContactService.submit(input)

    // 201 Created — a new resource (contact submission) was created
    sendSuccess(
      res,
      contact,
      201,
      "Message sent successfully. I'll be in touch soon!"
    )
  }),
}
