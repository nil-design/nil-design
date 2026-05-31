---
name: react-best-practices
description: "Use for React tasks in any project, including React components, hooks, context, client-side data flow, rendering performance, re-render reduction, bundle-size review, dynamic imports, async waterfall cleanup, and React/TypeScript refactors. This is framework-agnostic React guidance and intentionally omits framework-specific routing, server endpoint, and server component rules."
---

# React Best Practices

Use this skill when writing, reviewing, or refactoring React code. It is adapted from Vercel's React performance rule library, with framework-specific routing, endpoint, server component, and deployment rules removed so the guidance stays portable across Vite, libraries, docs sites, and custom React apps.

## Workflow

1. Identify the runtime shape: component library, client app, SSR-enabled app, docs/example surface, or shared hook/helper package.
2. Read the closest existing component, hook, test, and package scripts before changing code.
3. Apply correctness first: clear props/state/data flow, predictable side effects, and accessible DOM.
4. Run performance rules after behavior is clear, prioritizing async waterfalls, bundle size, and avoidable re-renders.
5. Validate with the narrowest meaningful test/build command, then broaden if the change touches shared behavior.

## Rule Categories

| Priority | Category | Use For | Rule Prefix |
| --- | --- | --- | --- |
| 1 | Eliminating waterfalls | independent async work, deferred awaits, Suspense boundaries | `async-` |
| 2 | Bundle size | direct imports, dynamic imports, intent preloading, analyzable paths | `bundle-` |
| 3 | Client-side data and effects | request deduplication, listeners, storage contracts | `client-` |
| 4 | Re-render optimization | render-derived state, memo boundaries, stable callbacks | `rerender-` |
| 5 | Rendering performance | DOM/layout/SVG/hydration/resource hint choices | `rendering-` |
| 6 | JavaScript performance | maps, sets, early exits, loop and allocation costs | `js-` |
| 7 | Advanced React patterns | handler refs, one-time init, latest callback refs | `advanced-` |

## Quick Reference

- Start independent promises before awaiting and use `Promise.all` when dependencies allow it.
- Defer expensive async work until the branch that needs it.
- Keep imports and dynamic import paths statically analyzable.
- Lazy-load heavy UI with `React.lazy`, route-level code splitting, or the project's existing bundler integration.
- Deduplicate global event listeners and clean them up reliably.
- Use passive listeners for scroll/touch paths when `preventDefault` is not needed.
- Derive render state during render instead of mirroring it with effects.
- Use effects for synchronization with external systems, not for ordinary data derivation.
- Memoize expensive work or identity-sensitive boundaries; avoid memo for simple primitive expressions.
- Use functional state updates to keep callbacks stable without stale reads.
- Use lazy `useState` initialization for expensive initial values.
- Use `startTransition` and `useDeferredValue` for non-urgent expensive updates.
- Store high-frequency transient values in refs when rendering does not need them.
- Avoid defining components inside components.
- Prefer Set/Map for repeated lookups and early return before expensive work.

## Detailed Rules

Read individual rule files when a task touches that area. Rule files contain the original rule shape or a framework-agnostic adaptation with bad/good examples.

Examples:

~~~text
rules/async-parallel.md
rules/bundle-dynamic-imports.md
rules/rerender-derived-state-no-effect.md
rules/client-event-listeners.md
~~~

## Attribution

This skill is adapted from `vercel-labs/agent-skills` `react-best-practices`, which declares MIT licensing in its skill metadata and repository README. Keep `references/upstream-attribution.md` with copied or substantially derived content.