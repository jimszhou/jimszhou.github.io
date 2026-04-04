# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build static site to ./out
npm run lint     # Run linter
```

Deployment is automatic via GitHub Actions on push to `main` — no manual deploy needed.

## Architecture

Personal portfolio/blog built with **Next.js (App Router, static export)**, **TypeScript**, **Tailwind CSS v4**, and **MDX** for content.

- Static site generation: all pages pre-rendered at build time, output to `./out` for GitHub Pages
- Content is markdown files in `/content/` parsed at build time via `gray-matter` and rendered with `next-mdx-remote`
- Firebase Realtime Database is used solely for visitor analytics (client-side only)

## Content System

**Adding a blog post ("checkin"):** create `/content/checkins/YYYY-MM-DD.md` with frontmatter:
```yaml
---
title: "Title"
tags: ["tag1", "tag2"]
---
```

Content directories: `checkins/` (blog posts), `projects/` (project cards), `resume.json`, `site.json` (hero/nav/footer text).

**Key content utilities** in `src/lib/`:
- `content.ts` — `getContentBySlug(dir, slug)`, `getAllContent(dir)` (sorted newest-first)
- `mdx.ts` — `renderMDX(source)` compiles MDX with remark-gfm + rehype-pretty-code (github-dark theme)

Dynamic routes (`/checkin/[date]`, `/projects/[slug]`) use `generateStaticParams()` for static generation.

## Styling

Tailwind v4 with a custom dark-first warm palette. Accent color is orange `#E07B39`. Prose styles for MDX content are defined in `src/app/globals.css`. The `.dark` variant is applied globally (not via class toggling).

## Firebase / Analytics

`src/lib/firebase.ts` — lazy singleton init using `NEXT_PUBLIC_FIREBASE_*` env vars (injected at build time from GitHub Actions secrets). The `VisitorTracker` component deduplicates visits via localStorage (24h TTL) and sanitizes Firebase key chars.
