---
title: Defer Non-Critical Third-Party Work
impact: MEDIUM
tags: bundle, third-party, hydration
---

## Defer Non-Critical Third-Party Work

Analytics, logging, surveys, and other non-critical tools should not block the first useful render. Load them after the page is interactive, after consent, or after the feature that needs them becomes active.

**Incorrect: non-critical library is part of the initial module graph**

~~~tsx
import { initAnalytics } from './analytics';

initAnalytics();
~~~

**Correct: load after the app has mounted or consent is available**

~~~tsx
import { useEffect } from 'react';

export function AnalyticsBootstrap({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    void import('./analytics').then(mod => {
      if (!cancelled) mod.initAnalytics();
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return null;
}
~~~

Keep error reporting or observability that is required for startup reliability in the main path only when the product requirement justifies the cost.