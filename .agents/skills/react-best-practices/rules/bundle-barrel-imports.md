---
title: Avoid Heavy Barrel Imports
impact: HIGH
tags: bundle, imports, libraries
---

## Avoid Heavy Barrel Imports

Large barrel entry points can pull broad module graphs into dev startup, tests, SSR bundles, or production chunks. Prefer imports that the current bundler and package can tree-shake reliably, and use package-level direct subpaths only when they are supported and typed.

**Incorrect: imports from a broad barrel when only one module is needed**

~~~tsx
import { debounce } from 'lodash';
import { HeavyChart } from '@acme/widgets';
~~~

**Correct: import the smallest supported entry**

~~~tsx
import debounce from 'lodash-es/debounce';
import HeavyChart from '@acme/widgets/HeavyChart';
~~~

Keep the public package import when direct subpaths are unsupported, untyped, or forbidden by the package exports map. Prefer project-native bundler configuration only when it is already part of the stack and type-safe.