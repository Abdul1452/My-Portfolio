/// <reference types="vite/client" />

/**
 * vite-env.d.ts — Vite Environment Type Definitions
 *
 * WHAT THE TRIPLE-SLASH LINE DOES:
 *   /// <reference types="vite/client" />
 *   This pulls in Vite's built-in types so TypeScript understands
 *   special Vite features like import.meta.env and import.meta.hot.
 *
 * WHY DEFINE ImportMetaEnv?
 *   By default, import.meta.env.VITE_ANYTHING is typed as `string | undefined`
 *   with no autocomplete. By declaring our specific vars here, we get:
 *     - Autocomplete for import.meta.env.VITE_API_BASE_URL
 *     - Type errors if we typo a variable name
 *     - Documentation of exactly which env vars the frontend expects
 *
 * IMPORTANT: Only VITE_-prefixed variables are exposed to the browser.
 *   This is a Vite security feature — it prevents accidentally leaking
 *   server secrets (like DATABASE_URL) into the client bundle.
 */

interface ImportMetaEnv {
  /** Base URL of the backend API, e.g. http://localhost:4000/api/v1 */
  readonly VITE_API_BASE_URL: string

  /** Public site URL, used for OG meta tags */
  readonly VITE_SITE_URL: string

  /** Contact email shown in the UI */
  readonly VITE_CONTACT_EMAIL: string

  /** LinkedIn profile URL */
  readonly VITE_LINKEDIN_URL: string

  /** GitHub profile URL */
  readonly VITE_GITHUB_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
