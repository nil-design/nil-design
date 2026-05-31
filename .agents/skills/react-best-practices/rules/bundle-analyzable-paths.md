---
title: Prefer Statically Analyzable Paths
impact: HIGH
tags: bundle, dynamic-import, build
---

## Prefer Statically Analyzable Paths

Build tools work best when import and file-system paths are obvious at build time. If a path is hidden inside a broad variable or composed too dynamically, the tool may include too much code, fail to split chunks well, or lose useful warnings.

**Incorrect: the bundler cannot see the reachable modules**

~~~ts
const modules = {
  home: './pages/home',
  settings: './pages/settings',
} as const;

const Page = await import(modules[name]);
~~~

**Correct: keep the import expressions explicit**

~~~ts
const modules = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const;

const Page = await modules[name]();
~~~

Use explicit maps for allowed modules, asset roots, and content directories. This keeps bundles narrow and makes failures easier to inspect.