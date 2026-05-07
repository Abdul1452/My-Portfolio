/**
 * Contact.model.ts — Database Access for Contact Submissions
 *
 * Unlike projects and skills, contact is WRITE-heavy (we create records).
 * We also never expose contact submissions to the public API —
 * they're internal data for the portfolio owner.
 *
 * The `create` method saves the form data.
 * The `markRead` method is for a future admin panel ("I've seen this message").
 */

import { db } from '@config/database'
import type { ContactInput, ContactDTO } from '@types/index'

export const ContactModel = {
  /**
   * create — Save a new contact form submission
   *
   * @param data - Sanitized and validated contact form fields
   * @returns ContactDTO (subset of fields, no internal data)
   */
  async create(data: ContactInput): Promise<ContactDTO> {
    const contact = await db.contact.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        // `read` defaults to false in the Prisma schema
        // `createdAt` defaults to now() in the Prisma schema
      },
      // Only select what we want to return to the API caller
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
        // NOT selecting: message, read (internal fields)
      },
    })

    return {
      ...contact,
      // Prisma returns createdAt as a Date object.
      // We convert to ISO string for consistent JSON serialization.
      createdAt: contact.createdAt.toISOString(),
    }
  },

  /**
   * markRead — Mark a contact submission as read (for admin use)
   *
   * @param id - The contact record's cuid
   */
  async markRead(id: string): Promise<void> {
    await db.contact.update({
      where: { id },
      data: { read: true },
    })
  },
}
