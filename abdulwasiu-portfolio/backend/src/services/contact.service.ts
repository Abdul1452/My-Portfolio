/**
 * contact.service.ts — Business Logic for Contact Form
 *
 * This service does TWO things in sequence:
 *   1. Save the contact to the database (ContactModel.create)
 *   2. Send an email notification (EmailService.sendContactNotification)
 *
 * This is a great example of WHY services exist.
 * The controller shouldn't care about the "save then email" orchestration —
 * it just calls contactService.submit(data) and trusts it'll do the right thing.
 */

import { ContactModel }   from '@models/Contact.model'
import { EmailService }   from './email.service'
import { sanitizeContactInput } from '@utils/sanitize'
import type { ContactInput, ContactDTO } from '@app-types'

export const ContactService = {
  /**
   * submit — Process a contact form submission
   *
   * Steps:
   *   1. Sanitize input (strip HTML, trim whitespace)
   *   2. Save to database
   *   3. Send email notification (non-blocking — doesn't affect response)
   *   4. Return confirmation DTO
   */
  async submit(rawInput: ContactInput): Promise<ContactDTO> {
    // 1. Sanitize — belt AND suspenders with Zod validation
    //    Zod already validated the shape; sanitize cleans the content
    const input = sanitizeContactInput(rawInput)

    // 2. Save to database
    const contact = await ContactModel.create(input)

    // 3. Send email notification — fire and forget
    //    We deliberately do NOT await this.
    //    The email sending happens in the background.
    //    If it fails, EmailService logs the error — the user still gets a success response.
    void EmailService.sendContactNotification(input)
    // `void` tells TypeScript "I know this returns a promise and I'm intentionally
    // not awaiting it" — suppresses the "floating promise" lint warning

    // 4. Return the saved contact (without the message body — just confirmation)
    return contact
  },
}
