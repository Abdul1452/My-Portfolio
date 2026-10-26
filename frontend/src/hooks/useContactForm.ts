/**
 * useContactForm.ts — Contact Form State, Validation & Submission
 *
 * THIS IS THE MOST COMPLEX HOOK — it manages the whole form lifecycle:
 *   1. Field values (controlled inputs)
 *   2. Field-level validation errors
 *   3. Submission status (idle → loading → success/error)
 *   4. The actual API call to POST /contact
 *
 * CONTROLLED INPUTS EXPLAINED:
 *   In React, a "controlled" input is one whose value comes FROM state.
 *   The input shows state.name, and onChange updates state.name.
 *   React is the single source of truth — the DOM never holds its own value.
 *     <input value={values.name} onChange={e => handleChange('name', e.target.value)} />
 *
 * WHY VALIDATE ON THE CLIENT IF THE SERVER ALSO VALIDATES?
 *   - Client validation = instant feedback, no network round-trip, better UX
 *   - Server validation = the REAL security boundary (never trust the client)
 *   We do BOTH. These rules mirror the backend's Zod contactSchema so the
 *   user rarely hits a server rejection.
 */

import { useState, useCallback } from 'react'
import { api } from '@utils/api'
import { ApiError } from '@app-types'
import type {
  ContactFormData,
  ContactFormErrors,
  ContactFormStatus,
} from '@app-types'

// The empty starting state for the form.
const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

// ─── Client-side validation ─────────────────────────────────────────────────
//
// Returns an errors object. If it's empty ({}), the form is valid.
// These rules MATCH the backend Zod schema (backend/src/utils/validators.ts).

function validate(values: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  // Name: 2–100 chars
  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (values.name.trim().length > 100) {
    errors.name = 'Name must be at most 100 characters'
  }

  // Email: simple but effective format check
  // (The backend does the authoritative check; this catches obvious typos.)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  // Subject: 5–200 chars
  if (values.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters'
  } else if (values.subject.trim().length > 200) {
    errors.subject = 'Subject must be at most 200 characters'
  }

  // Message: 20–2000 chars
  if (values.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters'
  } else if (values.message.trim().length > 2000) {
    errors.message = 'Message must be at most 2000 characters'
  }

  return errors
}

// ─── The hook ─────────────────────────────────────────────────────────────────

export function useContactForm() {
  const [values, setValues] = useState<ContactFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<ContactFormStatus>('idle')
  const [serverMessage, setServerMessage] = useState<string>('')

  // handleChange updates one field and clears that field's error as the
  // user types (so errors don't linger while they fix them).
  const handleChange = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setValues(prev => ({ ...prev, [field]: value }))
      // Clear this field's error if it had one
      setErrors(prev => {
        if (!prev[field]) return prev
        const next = { ...prev }
        delete next[field]
        return next
      })
    },
    []
  )

  // Reset the form back to empty (used after a successful submit).
  const reset = useCallback(() => {
    setValues(EMPTY_FORM)
    setErrors({})
    setStatus('idle')
    setServerMessage('')
  }, [])

  // submit runs validation, then calls the API.
  const submit = useCallback(async () => {
    // 1. Client-side validation first
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return // stop — don't hit the API with invalid data
    }

    // 2. Submit to the backend
    setStatus('loading')
    setServerMessage('')

    try {
      // POST /contact — the api helper returns the `data` field on success.
      await api.post('/contact', values)

      setStatus('success')
      setServerMessage("Message sent successfully. I'll be in touch soon!")
      setValues(EMPTY_FORM) // clear the form on success
    } catch (error) {
      setStatus('error')

      // If the server returned structured validation issues (422), map them
      // back onto the per-field errors so they show under the right inputs.
      if (error instanceof ApiError) {
        if (error.issues && error.issues.length > 0) {
          const fieldErrors: ContactFormErrors = {}
          for (const issue of error.issues) {
            // issue.field matches a form field name
            fieldErrors[issue.field as keyof ContactFormData] = issue.message
          }
          setErrors(fieldErrors)
          setServerMessage('Please fix the highlighted fields.')
        } else {
          // Rate limited, server error, etc. — show the server's message.
          setServerMessage(error.message)
        }
      } else {
        setServerMessage('Something went wrong. Please try again later.')
      }
    }
  }, [values])

  return {
    values,
    errors,
    status,
    serverMessage,
    handleChange,
    submit,
    reset,
    // Convenience booleans for the UI
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  }
}
