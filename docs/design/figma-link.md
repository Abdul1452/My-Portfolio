# Figma Design Files

## Main Design File (Portfolio v5)
**URL:** https://www.figma.com/design/fCKOa5EBD4T73fJpmkI8pV

A replica of the current site, built from `frontend/src/styles/portfolio-v5.css`
and `frontend/src/data/portfolio.data.ts`, so design changes can be tried in
Figma before they are coded.

### Pages in the File

| Page | Purpose |
|---|---|
| Portfolio v5 | Desktop homepage (1440px), dark theme, every section |
| Components | Button, Badge, Skill, Pill, Chip, Status pill, Theme button, Row, FAQ item, Step card |

## Design Tokens

The **Portfolio v5** variable collection mirrors the CSS custom properties in
`portfolio-v5.css` (`color/bg` = `--bg`, `color/ink-2` = `--ink-2`, …), with a
**Dark** and a **Light** mode. Select the homepage frame and switch its
variable mode to preview the light theme.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#11110f` | `#f5f3ee` |
| `--surface` | `#1a1917` | `#ffffff` |
| `--ink` | `#f2efe8` | `#1c1b18` |
| `--ink-3` | `#9d978b` | `#6b665c` |
| `--accent` | `#2f5bd3` | `#2f5bd3` |
| `--ok` | `#5cbf83` | `#2c7a4b` |
| Sans | Onest | Onest |
| Mono | JetBrains Mono | JetBrains Mono |

Not linked to variables: the radial gradients behind the hero, tiles and
contact card, and the GitHub heatmap's middle shades (CSS `color-mix()`), use
the dark values directly.

## Archived

The earlier design (Sora / IBM Plex Mono, green accent) is at
https://www.figma.com/design/yvwX9f1hdoEpidLPBewcV6. It no longer matches the site.
