# Figma Screen Fidelity Checklist

Use this after Codex generates a screen from Figma.

## Visual parity

- Layout and alignment match the Figma screenshot
- Typography matches (font family, size, weight, line-height)
- Colors match token values
- Borders, radii, and shadows match
- Icons and images match the exported Figma assets

## Implementation quality

- Route created at `src/app/(prototypes)/<slug>/page.tsx`
- Reusable UI moved into `src/components/ui/` where appropriate
- `src/styles/tokens.css` updated for newly used variables
- Assets saved under `public/assets/<slug>/`

## Runtime checks

- `npm run dev` starts without errors
- Page renders at the expected URL
- Desktop viewport matches the designed frame size
- Additional breakpoints implemented only if present in Figma
