# Medscape AI Prototyping Workspace

Next.js + Tailwind workspace for Figma-driven prototype screens implemented with Codex in Cursor.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project structure

- `src/app/(prototypes)/<slug>/page.tsx`: route for each prototype screen
- `src/components/ui/`: reusable primitives for prototype screens
- `src/components/screens/`: composed screen sections
- `src/styles/tokens.css`: CSS variables generated/mapped from Figma Variables
- `public/assets/<slug>/`: images and SVG assets returned by Figma MCP
- `docs/codex-figma-prompts.md`: copy/paste prompts for Codex in Cursor

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
