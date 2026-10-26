/**
 * formatDate.ts — Date Formatting Helpers
 *
 * The backend sends dates as ISO strings: "2025-04-03T12:00:00.000Z"
 * These aren't human-friendly. These helpers convert them to readable text.
 *
 * Intl.DateTimeFormat is the built-in browser API for locale-aware date
 * formatting — no external library (like moment.js) needed.
 */

/**
 * formatDate — "2025-04-03T12:00:00Z" → "3 April 2025"
 *
 * @param iso - ISO date string from the API
 * @param locale - BCP 47 locale tag, defaults to 'en-GB' (day-month-year)
 */
export function formatDate(iso: string, locale = 'en-GB'): string {
  const date = new Date(iso)

  // Guard against invalid dates — new Date('garbage') gives "Invalid Date"
  if (isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * formatRelativeTime — "2025-04-01" → "3 days ago"
 * Useful for showing when a contact message arrived (admin panel).
 */
export function formatRelativeTime(iso: string, locale = 'en'): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''

  const now = Date.now()
  const diffMs = date.getTime() - now
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  // Intl.RelativeTimeFormat produces "3 days ago", "in 2 hours", etc.
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, 'day')

  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, 'hour')

  const diffMins = Math.round(diffMs / (1000 * 60))
  return rtf.format(diffMins, 'minute')
}
