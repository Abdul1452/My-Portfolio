/**
 * email.service.ts — Nodemailer Email Sending
 *
 * WHAT IS NODEMAILER?
 *   A Node.js library for sending emails via SMTP.
 *   SMTP (Simple Mail Transfer Protocol) is the standard way
 *   applications talk to email servers (Gmail, Outlook, etc.).
 *
 * HOW IT WORKS:
 *   1. You create a "transporter" — a connection to your SMTP server
 *      configured with your credentials (from env vars)
 *   2. You call transporter.sendMail({ from, to, subject, html })
 *   3. The SMTP server delivers the email
 *
 * TRANSPORTER SINGLETON:
 *   Same reason as the Prisma singleton — we create ONE transporter
 *   and reuse it. Opening a new SMTP connection per email is slow.
 *   The transporter maintains a connection pool internally.
 *
 * DEVELOPMENT TIP:
 *   Don't want to use real Gmail during development?
 *   Use Ethereal (https://ethereal.email) — a free fake SMTP service.
 *   Emails are captured and shown in a web UI. Never actually delivered.
 */

import nodemailer from 'nodemailer'
import { env }    from '@config/env'
import { logger } from '@config/logger'
import type { ContactInput } from '@app-types'

// ─── Create the transporter singleton ────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,   // true = TLS (port 465), false = STARTTLS (port 587)
    auth: env.SMTP_USER && env.SMTP_PASS
      ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
      : undefined,
    // If no SMTP credentials in env, skip auth (useful for local mail servers)
  })
}

// Lazy initialization — only create transporter when first needed
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = createTransporter()
  }
  return transporter
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildContactNotificationHtml(contact: ContactInput): string {
  // Template literal for the email body (HTML)
  // Keeping it simple but readable
  return `
    <div style="font-family: 'IBM Plex Mono', monospace; max-width: 600px; margin: 0 auto;">
      <div style="background: #141419; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #33B587; margin: 0; font-size: 18px;">
          📬 New Portfolio Contact
        </h2>
      </div>
      <div style="background: #F5F5F0; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #707079; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 100px;">
              From
            </td>
            <td style="padding: 8px 0; color: #141419;">
              ${contact.name} &lt;${contact.email}&gt;
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #707079; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Subject
            </td>
            <td style="padding: 8px 0; color: #141419;">
              ${contact.subject}
            </td>
          </tr>
        </table>
        <hr style="border: 1px solid #D9D9D4; margin: 16px 0;" />
        <div style="color: #141419; line-height: 1.7; white-space: pre-wrap;">
          ${contact.message}
        </div>
        <hr style="border: 1px solid #D9D9D4; margin: 16px 0;" />
        <p style="color: #707079; font-size: 11px; margin: 0;">
          Sent from abdulwasiu.dev portfolio contact form
        </p>
      </div>
    </div>
  `
}

// ─── Public service methods ───────────────────────────────────────────────────

export const EmailService = {
  /**
   * sendContactNotification
   * Sends an email to the portfolio owner when someone submits the contact form.
   *
   * We use a try/catch here and LOG the error rather than throwing it.
   * Reason: email delivery failure shouldn't cause the contact form to
   * appear broken to the user. The contact is saved in the DB regardless.
   */
  async sendContactNotification(contact: ContactInput): Promise<void> {
    if (!env.CONTACT_EMAIL_TO) {
      logger.warn('[EmailService] CONTACT_EMAIL_TO not set — skipping email notification')
      return
    }

    try {
      const info = await getTransporter().sendMail({
        from: env.CONTACT_EMAIL_FROM,
        to: env.CONTACT_EMAIL_TO,
        replyTo: contact.email,   // "Reply" in your email client goes to the sender
        subject: `[Portfolio Contact] ${contact.subject}`,
        html: buildContactNotificationHtml(contact),

        // Plain text fallback for email clients that don't render HTML
        text: [
          `From: ${contact.name} <${contact.email}>`,
          `Subject: ${contact.subject}`,
          '',
          contact.message,
        ].join('\n'),
      })

      logger.info('[EmailService] Contact notification sent', {
        messageId: info.messageId,
        to: env.CONTACT_EMAIL_TO,
      })
    } catch (error) {
      // Log the error but don't re-throw — contact was already saved to DB
      logger.error('[EmailService] Failed to send contact notification', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  },

  /**
   * verifyConnection — Test SMTP connection (useful at startup)
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await getTransporter().verify()
      logger.info('[EmailService] SMTP connection verified ✓')
      return true
    } catch (error) {
      logger.warn('[EmailService] SMTP connection failed (emails will not send)', {
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  },
}
