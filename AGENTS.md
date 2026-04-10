# Medscape AI Prototype Workspace Rules

## Purpose

This repository is a Medscape AI prototype workspace for rapidly exploring reusable solution concepts. The goal is to build prototype screens and shared components that can be recomposed across future experiments without rebuilding the same UI patterns in each page.

## Architecture

- Route files in `src/app/**/page.tsx` must stay thin and only render a screen component.
- Screen components in `src/components/screens/` own page composition and page-level state.
- Reusable generic primitives belong in `src/components/ui/`.
- Reusable Medscape or solution-specific building blocks belong in `src/components/medscape/` rather than inside a screen file.
- Static content, prompt sets, icon maps, and other non-UI configuration belong in typed data or registry modules, not inline inside screens.

## Reuse Rules

- Do not rebuild reusable UI directly inside a route or page file.
- If a pattern is reused or is clearly reusable across prototype pages, extract it before adding another copy.
- Prefer composing existing shared components first, then add only the minimum new reusable pieces needed.
- Shared components should receive props and callbacks rather than hardcoding route transitions or page-specific decisions.

## Registration Rules

- Every new prototype page must be added to `src/registry/prototypes.ts`.
- Every reusable component that should be discoverable by the team must be added to `src/registry/gallery.tsx`.
- The gallery at `/gallery` is the canonical showcase for reusable components.

## Styling and Assets

- Use tokens from `src/styles/tokens.css` whenever a token already exists.
- Avoid hardcoded duplicate colors, spacing, radii, and typography values when a token is available.
- Keep prototype assets under `public/assets/<slug>/` when they are tied to a specific prototype.
- Preserve existing Medscape visual language when working inside Medscape-specific components.

## Change Expectations

- New pages should call shared screens and components instead of defining ad hoc markup.
- Screen refactors should move reusable pieces downward into the shared component layers, not upward into routes.
- Keep public component props typed and colocated with the component unless the type is purely data-oriented.
