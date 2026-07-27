/**
 * Button.tsx — The Button Atom
 *
 * ONE COMPONENT, MANY VARIANTS:
 *   Rather than PrimaryButton, OutlineButton, GhostButton as separate files,
 *   we build ONE Button that takes a `variant` prop. This is the standard
 *   pattern — it keeps all button logic and styling in one place.
 *
 * POLYMORPHIC RENDERING (button vs anchor):
 *   A "button" in a design might actually need to be a link (<a>) when it
 *   navigates somewhere, or a real <button> when it triggers an action.
 *   We check: if an `href` is passed, render <a>; otherwise render <button>.
 *   This keeps the HTML semantically correct — important for accessibility
 *   and SEO (screen readers announce links and buttons differently).
 *
 * TYPESCRIPT PROPS:
 *   We define a Props interface. Some props are our own (variant, size),
 *   and we also allow standard HTML attributes to pass through.
 */

import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@utils/cn'
import styles from './Button.module.css'

// The visual variants, matching the Figma Component Library.
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md'

interface ButtonProps {
  children: ReactNode          // The button label / content
  variant?: ButtonVariant      // Visual style, defaults to 'primary'
  size?: ButtonSize            // Padding size, defaults to 'md'
  href?: string                // If provided, renders as <a> instead of <button>
  external?: boolean           // If true (with href), opens in a new tab safely
  onClick?: () => void         // Click handler (for <button> mode)
  className?: string           // Extra classes from the parent
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']  // 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  onClick,
  className,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  // Build the class string: base + variant + size + any parent classes.
  // cn() merges them cleanly (see utils/cn.ts).
  const classes = cn(
    styles.button,
    styles[variant],   // styles.primary, styles.outline, etc.
    styles[size],      // styles.sm, styles.md
    className
  )

  // ── Render as a link if href is provided ────────────────────────────────────
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        // For external links, these two attributes are a security best practice:
        //   target="_blank"        → opens in new tab
        //   rel="noopener noreferrer" → prevents the new page from accessing
        //                                window.opener (a security/phishing risk)
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    )
  }

  // ── Otherwise render as a real button ───────────────────────────────────────
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
