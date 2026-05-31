---
title: Dynamically Import Heavy UI
impact: HIGH
tags: bundle, lazy-loading, react
---

## Dynamically Import Heavy UI

Lazy-load large components that are not needed for the initial interaction. Use the project's existing route-level code splitting, `React.lazy`, or a framework-agnostic dynamic import wrapper.

**Incorrect: heavy editor ships with the first chunk**

~~~tsx
import { MonacoEditor } from './monaco-editor';

export function CodePanel({ code }: { code: string }) {
  return <MonacoEditor code={code} />;
}
~~~

**Correct: load it only when rendered**

~~~tsx
import { lazy, Suspense } from 'react';

const MonacoEditor = lazy(() => import('./monaco-editor').then(mod => ({ default: mod.MonacoEditor })));

export function CodePanel({ code }: { code: string }) {
  return (
    <Suspense fallback={<div aria-busy="true" />}>
      <MonacoEditor code={code} />
    </Suspense>
  );
}
~~~

Do not lazy-load tiny components or critical above-the-fold content just to add indirection.