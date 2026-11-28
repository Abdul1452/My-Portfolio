/**
 * LinkedInSection.tsx — A business card you can keep + posts that feature me
 *
 * THE CARD:
 *   A two-sided business card in CSS 3D. It tilts toward the mouse and
 *   flips (button below it, or click the card) to show contact details.
 *   "Save contact" downloads a .vcf file built from portfolio.data.ts, so a
 *   recruiter can add you to their phone in one tap.
 *   Links sit BELOW the card, not on it: a link on the hidden face would
 *   still be reachable with Tab, which is confusing.
 *
 * THE POSTS:
 *   Each post is drawn by the page from linkedin.posts (author, excerpt,
 *   picture), so it's visible straight away and costs nothing. The original
 *   LinkedIn embed loads only when a visitor clicks "Show the original
 *   post": until then no LinkedIn code runs and no LinkedIn cookies are set
 *   (privacy by default, and a faster page).
 *
 * NO LINKEDIN SCRIPT:
 *   LinkedIn's official "profile badge" needs a third-party script that the
 *   site's Content-Security-Policy blocks on purpose. The card here shows
 *   the same information without it.
 */

import { useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Contact, ExternalLink, Github, Linkedin, Mail, MapPin, Repeat2 } from 'lucide-react'
import { linkedin, profile, type LinkedInPost } from '@data/portfolio.data'
import { SectionEyebrow } from './ui'
import { usePortfolioThemeContext } from './usePortfolioTheme'

/** "in/abdullahi-abdulwasiu-82114a234" from the profile URL, for the card. */
function linkedinHandle(url: string) {
  try {
    return new URL(url).pathname.replace(/^\/|\/$/g, '')
  } catch {
    return url
  }
}

/**
 * Only LinkedIn's own embed pages may be put in the iframe. Parsing the URL
 * and comparing the exact host stops look-alikes such as
 * "https://linkedin.com.evil.net/embed/…".
 */
export function safeLinkedInEmbed(url: string | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const ok = parsed.protocol === 'https:' && parsed.hostname === 'www.linkedin.com' && parsed.pathname.startsWith('/embed/')
    return ok ? parsed.toString() : null
  } catch {
    return null
  }
}

// ─── vCard ────────────────────────────────────────────────────────────────────

/** A vCard 3.0 text. Phones and mail apps import it as a contact. */
function buildVCard() {
  const [given, ...rest] = profile.fullName.split(' ')
  const family = rest.pop() ?? ''
  const middle = rest.join(' ')
  // vCard escapes commas and semicolons in values.
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1')
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};${esc(middle)};;`,
    `FN:${esc(profile.name)}`,
    `TITLE:${esc(linkedin.cardTagline)}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL;TYPE=LinkedIn:${profile.links.linkedin}`,
    `URL;TYPE=GitHub:${profile.links.github}`,
    `ADR;TYPE=WORK:;;;${esc(profile.location.split(',')[0])};;;Finland`,
    'END:VCARD',
  ].join('\r\n')
}

function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}.vcf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Give the download a moment to start before freeing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ─── Business card ────────────────────────────────────────────────────────────

export function BusinessCard() {
  const { reduceMotion } = usePortfolioThemeContext()
  const [flipped, setFlipped] = useState(false)

  const tilt = reduceMotion
    ? {}
    : {
        onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
          if (e.pointerType !== 'mouse') return
          const rect = e.currentTarget.getBoundingClientRect()
          const px = (e.clientX - rect.left) / rect.width
          const py = (e.clientY - rect.top) / rect.height
          e.currentTarget.style.setProperty('--rx', `${((0.5 - py) * 14).toFixed(2)}deg`)
          e.currentTarget.style.setProperty('--ry', `${((px - 0.5) * 18).toFixed(2)}deg`)
          e.currentTarget.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
          e.currentTarget.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
        },
        onPointerLeave(e: ReactPointerEvent<HTMLDivElement>) {
          for (const name of ['--rx', '--ry', '--gx', '--gy']) e.currentTarget.style.removeProperty(name)
        },
      }

  return (
    <div className="pf7-bcard-wrap">
      {/* The card itself is a picture of the details below it, so a screen
          reader skips it and reads the real links instead. */}
      <div className="pf7-bcard" {...tilt} onClick={() => setFlipped(f => !f)} aria-hidden="true">
        <div className="pf7-bcard__inner" data-flipped={flipped}>
          <div className="pf7-bcard__face pf7-bcard__front">
            <span className="pf7-bcard__glare" />
            <div className="pf7-bcard__top">
              <span className="pf7-bcard__mono">{profile.monogram}</span>
              <Linkedin size={22} className="pf7-bcard__brand" />
            </div>
            <div>
              <p className="pf7-bcard__name">{profile.name}</p>
              <p className="pf7-bcard__role">{linkedin.cardTagline}</p>
            </div>
            <p className="pf7-bcard__place"><MapPin size={13} /> {profile.location}</p>
          </div>
          <div className="pf7-bcard__face pf7-bcard__back">
            <span className="pf7-bcard__glare" />
            <div className="pf7-bcard__who">
              <img src={profile.avatarUrl} alt="" width={56} height={56} />
              <div>
                <p className="pf7-bcard__name" style={{ fontSize: 20 }}>{profile.fullName}</p>
                <p className="pf7-bcard__role">{linkedin.headline}</p>
              </div>
            </div>
            <ul className="pf7-bcard__lines">
              <li><Linkedin size={14} /> {linkedinHandle(profile.links.linkedin)}</li>
              <li><Github size={14} /> github.com/{profile.links.githubLogin}</li>
              <li><Mail size={14} /> {profile.email}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pf7-bcard__actions">
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--primary">
          <Linkedin size={18} aria-hidden="true" /> Connect on LinkedIn
        </a>
        <button type="button" className="pf5-btn pf5-btn--ghost" onClick={downloadVCard}>
          <Contact size={18} aria-hidden="true" /> Save contact
        </button>
        <button type="button" className="pf5-btn pf5-btn--ghost" aria-pressed={flipped} onClick={() => setFlipped(f => !f)}>
          <Repeat2 size={18} aria-hidden="true" /> Flip card
        </button>
      </div>
    </div>
  )
}

// ─── Posts ────────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: LinkedInPost }) {
  const [showOriginal, setShowOriginal] = useState(false)
  const embed = safeLinkedInEmbed(post.embedUrl)
  const initials = post.author.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <article className="pf7-post">
      <header className="pf7-post__head">
        <span aria-hidden="true" className="pf7-post__avatar">{initials}</span>
        <div style={{ minWidth: 0 }}>
          <p className="pf7-post__author">{post.author}</p>
          <p className="pf7-post__meta">{[post.authorRole, post.date].filter(Boolean).join(' · ')}</p>
        </div>
        <span className="pf7-post__kind" data-kind={post.kind}>{post.kind === 'features-me' ? 'Features me' : 'My post'}</span>
      </header>

      {showOriginal && embed ? (
        <iframe
          className="pf7-post__embed"
          src={embed}
          title={`LinkedIn post by ${post.author}`}
          loading="lazy"
          allowFullScreen
        />
      ) : (
        <>
          <p className="pf7-post__text">{post.excerpt}</p>
          {post.image && <img className="pf7-post__img" src={post.image} alt={post.imageAlt ?? ''} loading="lazy" decoding="async" />}
        </>
      )}

      <footer className="pf7-post__foot">
        <a href={post.url} target="_blank" rel="noreferrer">
          Read on LinkedIn <ExternalLink size={14} aria-hidden="true" />
        </a>
        {embed && !showOriginal && (
          <button type="button" className="pf7-linkbtn" onClick={() => setShowOriginal(true)}>
            Show the original post
          </button>
        )}
      </footer>
      {embed && !showOriginal && <p className="pf7-post__note">The original loads from LinkedIn, which may set cookies.</p>}
    </article>
  )
}

export function LinkedInSection() {
  const { posts } = linkedin

  return (
    <section id="linkedin" data-screen-label="LinkedIn" className="pf5-section pf7-li" data-posts={posts.length}>
      <div className="pf7-li__intro">
        <div className="pf7-li__text">
          <SectionEyebrow section="linkedin" />
          <h2 className="pf5-h2">{posts.length ? 'What others have said' : 'Let’s stay in touch'}</h2>
          <p className="pf5-lead">
            {posts.length
              ? 'Posts on LinkedIn that feature my work, and a card to keep. Flip it for my details, or save it straight to your contacts.'
              : 'I share what I learn while building on LinkedIn. Here’s my card: flip it for my details, or save it straight to your contacts.'}
          </p>
        </div>
        <BusinessCard />
      </div>

      {posts.length > 0 && (
        <div className="pf7-li__posts">
          {posts.map(post => <PostCard key={post.url} post={post} />)}
        </div>
      )}
    </section>
  )
}
