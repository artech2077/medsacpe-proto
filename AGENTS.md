# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start Next.js dev server on localhost:3000
pnpm build      # Production build
pnpm start      # Run production server
vitest run      # Run all tests once (no watch)
```

Package manager is **pnpm** (enforced via `pnpm-workspace.yaml`).

## Architecture

This is a Next.js 16 + React 19 + Tailwind CSS v4 prototype workspace for iterating on Medscape AI product experiences before production.

### Registry-driven routing

Two files are the source of truth:
- `src/registry/prototypes.ts` — defines all prototype routes shown on `/`
- `src/registry/gallery.tsx` — defines all component gallery entries shown on `/gallery`

**To add a new prototype**, add an entry to `prototypeRegistry` and create `src/app/(prototypes)/<slug>/page.tsx` as a thin wrapper that renders a screen component. Do not put logic in page.tsx.

### Component hierarchy

```
src/components/ui/           — generic primitives (ScreenShell, etc.)
src/components/medscape/
  ai-response/               — AI response flow: answer content, key points, chat composer, etc.
  ai-current/                — Current Medscape AI UI: header, ad block, feature-updates modal
  drug-ai-tables/            — Drug monograph with embedded AI prompt tables
src/components/screens/      — page-level compositions that combine the above
```

**Always check `src/registry/gallery.tsx` and `src/components/medscape/` before creating a new component.** The gallery documents every reusable component with usage notes.

When creating or extending any prototype page, screen, or component, invoke the `medscape-component-reuse` skill first. It enforces the inventory-before-build workflow: reuse matching components exactly, and only create new ones for genuinely new functionality.

### Data layer

Mock content lives in `src/data/` as typed modules (e.g., `ai-response.ts`, `medscape-feature-updates.ts`, `hantavirus.ts`). Screen components consume data from here rather than inlining strings.

### Styling

CSS custom properties (tokens) live in `src/styles/tokens.css` — these are mapped from Figma Variables and are the canonical source for colors, spacing, radii, and typography. Use token variables instead of hardcoding values.

Fonts are configured in `src/styles/fonts.ts` using `next/font/google` (Nunito Sans + Geist Mono) and exposed as CSS variables `--font-prototype-sans` and `--font-prototype-mono`.

### Production access

`src/proxy.ts` allows production, local development, and Vercel preview deployments to access every prototype route and gallery page.

### Analytics

PostHog integration is in `src/lib/analytics/`. Events are constructed via `buildAnalyticsPayload` and fired through `AnalyticsLink` / `AnalyticsRouteTracker` components. Auto-strips identity fields. See `docs/analytics-tagging-plan.md` and `docs/paid-ads-exp-posthog-tracking.md` for naming conventions and tracking specs.

## Figma → prototype workflow

When implementing a screen from a Figma frame, use the prompts in `docs/codex-figma-prompts.md`. The required step order is:
1. `get_design_context`
2. `get_screenshot`
3. Download/save assets to `public/assets/<slug>/`
4. Run `get_variable_defs` and update `src/styles/tokens.css` if new variables appear
5. Build the page at `src/app/(prototypes)/<slug>/page.tsx`

Assets and routes must be named after the slug. Do not introduce new icon packages if Figma exports are provided.
