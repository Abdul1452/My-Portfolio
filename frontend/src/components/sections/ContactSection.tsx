/**
 * ContactSection.tsx — Contact Info + Working Form
 *
 * WIRING THE FORM HOOK:
 *   All the form logic (state, validation, submit, status) lives in
 *   useContactForm (Phase 5). This component just connects that hook to
 *   inputs and renders the current state. The component stays declarative:
 *   it describes WHAT the form looks like in each state, not HOW it works.
 *
 * CONTROLLED INPUTS:
 *   Each input's value comes from `values.x` and updates via handleChange.
 *   React is the single source of truth for what's typed.
 *
 * FIELD ERRORS + FORM STATUS:
 *   - errors.email shows under the email field when invalid.
 *   - status drives the submit button label and the success/error message.
 *
 * ACCESSIBILITY:
 *   Labels are tied to inputs via htmlFor/id. Error messages use role="alert"
 *   so screen readers announce them when they appear.
 */

import { Section } from '@layout'
import { SectionLabel, Button, ScrollReveal } from '@ui'
import { useContactForm } from '@hooks/useContactForm'
import { siteMeta } from '@data/meta.data'
import { cn } from '@utils/cn'
import styles from './ContactSection.module.css'

export function ContactSection() {
  const {
    values,
    errors,
    serverMessage,
    handleChange,
    submit,
    isLoading,
    isSuccess,
  } = useContactForm()

  // Prevent the browser's default form submission (page reload) and call
  // our async submit instead.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <Section id="contact" background="dark">
      <div className={styles.grid}>
        {/* ── Left: contact info ─────────────────────────────────────────── */}
        <ScrollReveal className={styles.info}>
          <SectionLabel number="04" label="Get in Touch" />
          <h2 className={styles.title}>
            Let&apos;s Build &amp;<br />
            Deliver Together.
          </h2>
          <p className={styles.subtitle}>
            Open to full-time roles, freelance projects, and collaborations in
            the Finnish &amp; Nordic tech and PM market.
          </p>
          <a href={`mailto:${siteMeta.email}`} className={styles.email}>
            {siteMeta.email} →
          </a>
        </ScrollReveal>

        {/* ── Right: the form ────────────────────────────────────────────── */}
        <ScrollReveal delay={2} className={styles.formWrap}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                id="name"
                type="text"
                className={cn(styles.input, errors.name && styles.inputError)}
                value={values.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Your name"
              />
              {errors.name && (
                <span className={styles.error} role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                className={cn(styles.input, errors.email && styles.inputError)}
                value={values.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className={styles.error} role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Subject */}
            <div className={styles.field}>
              <label htmlFor="subject" className={styles.label}>
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className={cn(styles.input, errors.subject && styles.inputError)}
                value={values.subject}
                onChange={e => handleChange('subject', e.target.value)}
                placeholder="What's this about?"
              />
              {errors.subject && (
                <span className={styles.error} role="alert">
                  {errors.subject}
                </span>
              )}
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className={cn(styles.textarea, errors.message && styles.inputError)}
                value={values.message}
                onChange={e => handleChange('message', e.target.value)}
                placeholder="Tell me about your project or role…"
              />
              {errors.message && (
                <span className={styles.error} role="alert">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Sending…' : 'Send Message →'}
            </Button>

            {/* Server response message (success or error) */}
            {serverMessage && (
              <p
                className={cn(styles.serverMsg, isSuccess ? styles.success : styles.errorMsg)}
                role="alert"
              >
                {serverMessage}
              </p>
            )}
          </form>
        </ScrollReveal>
      </div>
    </Section>
  )
}
