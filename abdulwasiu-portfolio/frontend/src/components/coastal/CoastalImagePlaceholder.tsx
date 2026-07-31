/**
 * CoastalImagePlaceholder.tsx — Styled Image Slot Placeholder
 *
 * No upload/admin backend exists yet (see backend/src — requireAuth is
 * scaffolded but unwired), so every image slot in the Coastal design
 * (headshot, project screenshots, CV preview, certificates) renders as a
 * captioned placeholder box for now, mirroring the `[ Screenshot ]`
 * convention ProjectCard already uses elsewhere in this app. Swap in a
 * real <img src="..."> once you have the asset — same shape props.
 */

import { cn } from '@utils/cn'

interface CoastalImagePlaceholderProps {
  shape?: 'rect' | 'rounded' | 'circle'
  caption: string
  className?: string
}

export function CoastalImagePlaceholder({
  shape = 'rounded',
  caption,
  className,
}: CoastalImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center border border-dashed border-coastal-green/25 bg-coastal-green/[0.04] px-3 text-center font-coastal-mono text-[11px] leading-snug text-coastal-ink/45',
        shape === 'circle' && 'rounded-full',
        shape === 'rounded' && 'rounded-[10px]',
        shape === 'rect' && 'rounded-none',
        className
      )}
    >
      {caption}
    </div>
  )
}
