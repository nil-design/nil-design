<p align="center">
  <img src="./docs/public/logo.svg" height="100" alt="Nil Design logo">
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/nil-design/nil-design" alt="License"></a>
  <a href="https://github.com/nil-design/nil-design/actions/workflows/deploy.yml"><img src="https://github.com/nil-design/nil-design/actions/workflows/deploy.yml/badge.svg" alt="Deploy status"></a>
  <a href="https://github.com/nil-design/nil-design/issues"><img src="https://img.shields.io/github/issues/nil-design/nil-design" alt="Issues"></a>
  <a href="https://github.com/nil-design/nil-design/network/members"><img src="https://img.shields.io/github/forks/nil-design/nil-design" alt="Forks"></a>
  <a href="https://github.com/nil-design/nil-design/stargazers"><img src="https://img.shields.io/github/stars/nil-design/nil-design" alt="Stars"></a>
</p>

<p align="center">
  English · <a href="./README.zh-CN.md">简体中文</a>
</p>

---

# Nil Design

Diversified React Development Library.

Nil Design is a diversified React development library for product interfaces: UI primitives, hooks, icons, i18n, shared foundations, and tooling that can be adopted together or one package at a time.

## Why Nil Design

- More than UI primitives: components live beside hooks, icons, i18n, shared utilities, and project tooling.
- Composable by default: tokens, state semantics, slots, and Tailwind CSS entrypoints keep product UI predictable.
- Adopt only what you need: available packages are published independently and share a small set of peer foundations.
- Close to the code: API tables, examples, and tooling are maintained from the same workspace.

## Packages

| Package | Role |
| - | - |
| `@nild/components` | React UI primitives and component styles. |
| `@nild/hooks` | Hooks for controllable state, effects, events, refs, observers, scroll lock, and timing. |
| `@nild/icons` | `Icon`, `DynamicIcon`, icon CSS, and per-icon imports backed by IconPark. |
| `@nild/i18n` | Lightweight i18n runtime with namespaces, fallback, plugins, interpolation, and typed usage. |
| `@nild/shared` | Shared types, React helpers, utilities, class merging, and token foundations. |
| `@nild/materials` | Planned higher-level materials for complete experience patterns. |

## Tooling

| Package | Role |
| - | - |
| `@nild/api-extractor` | Typedoc-powered API extraction for docs and automation. |
| `@nild/eslint-plugin` | Nil Design lint rules for local projects. |

## Install

```sh
pnpm add @nild/components @nild/hooks @nild/icons @nild/shared
```

Use smaller combinations when you only need one capability:

```sh
pnpm add @nild/hooks @nild/shared
pnpm add @nild/icons @nild/shared
pnpm add @nild/i18n @nild/shared
```

## Styles

```css
@import 'tailwindcss';
@import '@nild/components/tailwindcss';

@source '../node_modules/@nild/components/dist';
```

Adjust the `@source` path to match your app structure.

## Development

```sh
pnpm install
pnpm docs:dev
pnpm build
pnpm typecheck
pnpm test
```

## Documentation

- Home: https://nil-design.github.io/nil-design/en-US/

## Star History

<a href="https://www.star-history.com/?repos=nil-design%2Fnil-design&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=nil-design/nil-design&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=nil-design/nil-design&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=nil-design/nil-design&type=date&legend=top-left" />
 </picture>
</a>

## License

Apache License 2.0. See [LICENSE](./LICENSE).
