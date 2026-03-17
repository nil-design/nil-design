<p align="center">
  <img src="./docs/public/logo.svg" height="100" alt="Nil Design's Logo">
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/nil-design/nil-design"></a>
  <a><img src="https://github.com/nil-design/nil-design/actions/workflows/deploy.yml/badge.svg"></a>
  <a><img src="https://img.shields.io/github/issues/nil-design/nil-design"></a>
  <a><img src="https://img.shields.io/github/forks/nil-design/nil-design"></a>
  <a><img src="https://img.shields.io/github/stars/nil-design/nil-design"></a>
</p>

---

Nil Design is a diversified React development library. It brings components, hooks, icons, i18n, shared utilities, and companion materials into one workspace for building consistent React experiences.

## Packages

- `@nild/components`: composable foundational and interactive UI primitives, including Button, Checkbox, Divider, Input, Popover, Radio, Switch, Tooltip, Transition, and Typography.
- `@nild/hooks`: practical hooks for controllable state, effects, events, refs, storage, mounts, and other product-facing patterns.
- `@nild/i18n`: a lightweight i18n runtime with language-chain fallback, namespaces, interpolation plugins, and optional strict key inference.
- `@nild/icons`: `Icon` and `DynamicIcon` primitives, plus a CSS entry for icon styles.
- `@nild/shared`: shared interfaces, React helpers, utilities, and Tailwind CSS foundations used across the workspace.
- `@nild/materials`: companion materials for extending the system beyond components into more complete experiences.

## Install

The packages are published independently, so you can install only what you need.

```sh
pnpm add @nild/shared @nild/hooks @nild/i18n @nild/icons @nild/components
pnpm add @nild/materials
```

Common peer dependencies across the workspace include `react@^18.2.0`, `react-dom@^18.2.0`, `lodash-es`, and `tailwindcss@^4.1.7`.

## Docs

- Quick start and package docs: `https://nil-design.github.io/nil-design/zh-CN/guide/quick-start.html`
- Simplified Chinese docs: `https://nil-design.github.io/nil-design/zh-CN/`
- English overview: `https://nil-design.github.io/nil-design/en-US/`
