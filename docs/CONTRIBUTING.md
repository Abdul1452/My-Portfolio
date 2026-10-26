# Contributing Guide

## Branching Strategy

```
main          → production
develop       → integration branch
feature/*     → new features (branch from develop)
fix/*         → bug fixes
docs/*        → documentation only changes
```

## Commit Convention (Conventional Commits)

```
feat:     new feature
fix:      bug fix
docs:     documentation changes
style:    formatting only
refactor: code restructure (no behaviour change)
test:     adding/fixing tests
chore:    tooling / config changes
```

Examples:
```
feat(frontend): add GanttPreview component
fix(backend): handle missing contact email env var
docs: update API endpoint reference
```

## Code Style

- TypeScript strict mode on both frontend and backend
- Prettier + ESLint enforced
- Components: one component per file, matching `.module.css`
- Barrel exports: every folder has an `index.ts` re-exporting its contents

## Pull Request Checklist

- [ ] Code builds without errors (`pnpm build`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Component has its own `.module.css` if it has unique styles
- [ ] New types added to `src/types/`
- [ ] README updated if folder structure changed
