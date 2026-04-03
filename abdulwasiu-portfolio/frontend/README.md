# Frontend — Abdulwasiu Portfolio

> React 18 + TypeScript + Vite + Tailwind CSS

## 📁 Folder Structure

```
frontend/src/
├── main.tsx                    # React entry point
├── App.tsx                     # Root app with Router
├── vite-env.d.ts               # Vite environment types
│
├── pages/                      # Route-level page components
│   ├── HomePage.tsx            # Main single-page layout
│   ├── ProjectDetailPage.tsx   # Individual project case study
│   ├── PMGuidebookPage.tsx     # PM Guidebook full page
│   └── NotFoundPage.tsx        # 404 page
│
├── components/
│   ├── ui/                     # Atoms — smallest reusable UI pieces
│   │   ├── Button.tsx          # Primary / Outline / Ghost variants
│   │   ├── Badge.tsx           # Available-to-hire badge
│   │   ├── Pill.tsx            # Tech stack pills
│   │   ├── SectionLabel.tsx    # "01 — ABOUT" labels
│   │   ├── SkillBar.tsx        # Animated progress bar
│   │   ├── StatCard.tsx        # Hero stat card (5+ Years)
│   │   ├── ProjectCard.tsx     # Engineering project card
│   │   ├── FactCard.tsx        # About section fact cards
│   │   ├── PMCard.tsx          # PM project card (dark)
│   │   ├── Divider.tsx         # Accent divider line
│   │   ├── AnimatedDot.tsx     # Pulsing available dot
│   │   └── ScrollReveal.tsx    # Intersection observer wrapper
│   │
│   ├── layout/                 # App-level layout shells
│   │   ├── Navbar.tsx          # Desktop top nav
│   │   ├── MobileMenu.tsx      # Hamburger mobile menu
│   │   ├── Footer.tsx          # Footer with copyright
│   │   ├── PageWrapper.tsx     # Page-level spacing wrapper
│   │   └── Section.tsx         # Reusable section container
│   │
│   ├── sections/               # Full page sections (one per scroll area)
│   │   ├── HeroSection.tsx     # Landing hero with headline + pills
│   │   ├── AboutSection.tsx    # Bio + fact grid
│   │   ├── SkillsSection.tsx   # Skill category columns
│   │   ├── ProjectsSection.tsx # Engineering project cards
│   │   └── ContactSection.tsx  # Contact form + socials
│   │
│   └── pm/                     # PM-specific components
│       ├── PMSection.tsx       # PM projects section wrapper
│       ├── GanttPreview.tsx    # Gantt chart visual preview
│       ├── GuidebookCard.tsx   # Guidebook feature card
│       └── SprintCard.tsx      # Agile sprint planner card
│
├── hooks/                      # Custom React hooks
│   ├── useScrollAnimation.ts   # Scroll-triggered fade-in logic
│   ├── useIntersectionObserver.ts  # Generic IO hook
│   ├── useMobileMenu.ts        # Hamburger open/close state
│   ├── useContactForm.ts       # Form state + submit handler
│   └── useTheme.ts             # Theme toggle (future)
│
├── context/                    # React context providers
│   ├── ThemeContext.tsx         # Dark/light theme context
│   └── AppContext.tsx          # Global app state context
│
├── types/                      # TypeScript interfaces & types
│   ├── index.ts                # Re-exports all types
│   ├── project.types.ts        # Project interface
│   ├── skill.types.ts          # Skill / category types
│   ├── contact.types.ts        # Contact form types
│   └── api.types.ts            # API response shapes
│
├── data/                       # Static content (no DB needed for these)
│   ├── index.ts                # Re-exports all data
│   ├── projects.data.ts        # Engineering project list
│   ├── skills.data.ts          # Skill categories + items
│   ├── pm-projects.data.ts     # PM projects list
│   ├── experience.data.ts      # Work history timeline
│   └── meta.data.ts            # SEO / og tags data
│
├── utils/                      # Helper functions
│   ├── index.ts                # Re-exports
│   ├── cn.ts                   # Class name merger (clsx + tailwind-merge)
│   ├── formatDate.ts           # Date formatting helpers
│   ├── scrollTo.ts             # Smooth scroll utility
│   └── api.ts                  # Fetch wrapper for backend calls
│
└── styles/                     # Global CSS files
    ├── globals.css             # Global styles + Tailwind directives
    ├── tokens.css              # CSS custom properties (design tokens)
    ├── typography.css          # Font imports + text utilities
    ├── animations.css          # Keyframe animations
    └── reset.css               # CSS reset / normalize
```

## 🧩 Import Aliases

All paths are aliased via `tsconfig.json` and `vite.config.ts`:

```ts
import { Button } from '@ui/Button'
import { HeroSection } from '@sections/HeroSection'
import { useScrollAnimation } from '@hooks/useScrollAnimation'
import { projects } from '@data/projects.data'
import type { Project } from '@types/project.types'
```

## 🛠 Available Scripts

```bash
pnpm dev          # Start development server → localhost:5173
pnpm build        # Type-check + build for production
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler check only
```
