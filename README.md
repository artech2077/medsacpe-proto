# Medscape AI Prototyping Workspace

Next.js + Tailwind workspace for Figma-driven prototype screens implemented with Codex in Cursor.

## Run locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Project structure

- `src/app/(prototypes)/<slug>/page.tsx`: thin route wrappers that render screen components
- `src/app/gallery/page.tsx`: in-app gallery for reusable components
- `src/components/screens/`: page-level screen compositions
- `src/components/ui/`: generic reusable primitives
- `src/components/medscape/`: Medscape-specific reusable components and flows
- `src/registry/prototypes.ts`: source of truth for prototype routes shown on `/`
- `src/registry/gallery.tsx`: source of truth for gallery entries shown on `/gallery`
- `src/data/`: typed content and configuration modules consumed by screens/components
- `src/styles/tokens.css`: CSS variables generated/mapped from Figma Variables
- `public/assets/<slug>/`: images and SVG assets returned by Figma MCP
- `AGENTS.md`: canonical working rules for future prototype and component work

## Fonts (exact Figma match)

- Put local `.woff2` files in `src/assets/fonts/`
- Ask Codex to replace the fallback font setup in `src/styles/fonts.ts` with `next/font/local`
- Apply the same family/weights used in Figma

## Figma screen implementation workflow (Codex)

Use the prompt templates in `docs/codex-figma-prompts.md`. The required order is:

1. `get_design_context`
2. `get_screenshot`
3. asset download/save
4. token updates (`get_variable_defs` if needed)
5. page implementation at `src/app/(prototypes)/<slug>/page.tsx`

## Deploy

- Push the repo to GitHub/GitLab (private is fine)
- Import to Vercel and use preview deployments for stakeholder sharing

## Production access

Production, local development, and Vercel preview deployments all allow access
to every prototype route and gallery page.
