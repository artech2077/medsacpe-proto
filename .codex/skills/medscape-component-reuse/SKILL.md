---
name: medscape-component-reuse
description: Enforce component reuse for the Medscape AI prototype workspace. Use when creating, refactoring, or extending prototype pages, screens, Medscape-specific UI, gallery entries, or shared components so Codex inventories existing components first, reuses matching components exactly, and only creates new reusable components for genuinely new functionality or materially different designs.
---

# Medscape Component Reuse

## Overview

Use this skill to keep Medscape AI prototypes built from a growing shared component library instead of one-off or duplicate screen markup. The default outcome is composition from existing components; creating a new component is the exception and must produce a reusable library asset.

## Required Workflow

1. **Inventory first.** Before editing, inspect the existing component library and registries:
   - `src/registry/gallery.tsx`
   - `src/components/ui/`
   - `src/components/medscape/`
   - `src/components/screens/`
   - relevant typed data modules in `src/data/`

2. **List the needed features.** Break the requested prototype or change into functional parts, such as:
   - route shell and screen layout
   - global header or top rail
   - input/composer
   - prompt cards or suggested questions
   - progress/loading notice
   - answer content renderer
   - feedback/actions/footer
   - ads, references, follow-ups, icons, and static data

3. **Map each feature to an existing component.** For every feature, look for an existing component with the same functionality. Prefer exact reuse of the existing component name, props, and data shape. Reuse a component even if it was introduced by another prototype when the user-facing function is the same.

4. **Do not create duplicates.** Do not create a new component, near-copy, wrapper, or style variant for a feature that an existing component already covers. If a screen needs the AI Response input field, use the same input component invocation rather than building a current-specific input or variant.

5. **Create new components only for new functionality.** If no existing component matches, create the smallest reusable component in the correct shared layer:
   - generic primitives: `src/components/ui/`
   - Medscape or solution-specific blocks: `src/components/medscape/`
   - screen composition and page state: `src/components/screens/`
   - non-UI configuration/content: typed modules under `src/data/` or another registry module

6. **Register reusable assets.** Add discoverable reusable components to `src/registry/gallery.tsx`. Add every new prototype page to `src/registry/prototypes.ts`.

7. **Verify no duplicates remain.** After editing, search for old duplicate component names and near-copy files. Remove unused duplicate components and gallery entries when they are replaced by shared components.

## Component Matching Rules

- Match by functionality first, not by prototype name. A component in `ai-response` can be the canonical shared component for later prototypes.
- Prefer the exact same component invocation when the requested feature should behave and look the same.
- Do not add variants to keep duplicate designs alive. Use variants only when the existing component already supports a genuine reusable state or when the design is materially different and the variant will serve future prototypes.
- If the supplied design is completely different, create a new reusable component and register it. Do not bury it inside a screen file.
- Keep route files thin: `src/app/**/page.tsx` should render a screen component only.
- Keep public props typed and colocated with the component unless the type is purely data-oriented.

## Discovery Checklist

Use fast search when available:

```powershell
rg --files src/components src/registry src/data
rg "ComponentName|feature text|sourcePath|title:" src/components src/registry src/data
```

If `rg` is unavailable or blocked, use PowerShell:

```powershell
Get-ChildItem -Path src\components,src\registry,src\data -Recurse -File |
  Select-String -Pattern "ComponentName|feature text|sourcePath|title:"
```

Before implementing, produce a short internal reuse map:

```text
Feature -> existing component/data to reuse -> change needed
Input field -> AiResponseChatComposer -> use exact existing invocation
Prompt cards -> AiPromptSectionsList/AiPromptCard -> use existing data shape
Answer actions -> AiResponseAnswerActions -> replace duplicate footer
```

## New Component Gate

Only create a new component after answering all of these:

- What existing components were checked?
- Why does each existing component not satisfy the feature?
- Is the difference functional, or only visual/contextual?
- Can the existing component be reused exactly?
- If a new component is needed, where will future prototypes import it from?
- Should it be added to `src/registry/gallery.tsx`?

If the answer is "same functionality, same intended UI", do not create a new component.

## Validation

Run the repo's checks after changes:

```powershell
corepack pnpm lint
corepack pnpm build
```

When a dev server is available, verify affected prototype routes and `/gallery` return successfully. For visual changes, inspect the screen or capture a screenshot when practical.
