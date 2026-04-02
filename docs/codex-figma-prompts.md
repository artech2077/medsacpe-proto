# Codex + Figma MCP Prompts (Cursor)

Use these prompts in the Codex extension chat inside Cursor. Replace placeholders before sending.

## 1) Generate or update tokens from Figma Variables

```text
Use the Figma MCP workflow for this node: <FIGMA_URL>.

Task:
- Extract the fileKey and nodeId from the URL
- Run get_variable_defs for the node
- Map variables into src/styles/tokens.css as CSS custom properties
- Keep naming stable and readable (example: color/primary/500 -> --color-primary-500)
- Do not hardcode duplicate values in components if a token already exists

If a token already exists, update it instead of creating a duplicate name.
```

## 2) Implement a prototype screen from a Figma frame

```text
Implement this Figma frame pixel-perfect in the Next.js prototype workspace: <FIGMA_URL>

Target route:
- src/app/(prototypes)/<slug>/page.tsx

Required workflow (do not skip or reorder):
1. get_design_context(fileKey, nodeId)
2. get_screenshot(fileKey, nodeId)
3. Download and save any returned assets into public/assets/<slug>/
4. If new variables are used, run get_variable_defs(fileKey, nodeId) and update src/styles/tokens.css
5. Build the page using token-driven styles and reusable primitives in src/components/ui

Rules:
- Match the Figma screenshot exactly (layout, spacing, typography, colors, radii)
- Reuse existing primitives before creating new ones
- Do not introduce new icon packages if Figma assets are provided
- Keep assets and routes named after the slug
```

## 3) Convert fallback fonts to local fonts

```text
Replace the fallback font setup in src/styles/fonts.ts with next/font/local using font files in src/assets/fonts.

Requirements:
- Load the exact font family and weights used in Figma
- Export variables compatible with src/app/layout.tsx
- Keep --font-prototype-sans and --font-prototype-mono variable names
- If multiple weights/styles exist, configure them in one local font family export
```

## 4) Refactor repeated screen patterns into UI primitives

```text
Refactor repeated UI patterns used across prototype routes into reusable components in src/components/ui.

Constraints:
- Preserve pixel fidelity for existing routes
- Keep all colors, spacing, and radii token-driven from src/styles/tokens.css
- Do not change route URLs or file names
- Update imports in affected prototype pages
```
