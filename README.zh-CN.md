<p align="center">
  <img src="./docs/public/logo.svg" height="100" alt="Nil Design 标志">
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/nil-design/nil-design" alt="许可证"></a>
  <a href="https://github.com/nil-design/nil-design/actions/workflows/deploy.yml"><img src="https://github.com/nil-design/nil-design/actions/workflows/deploy.yml/badge.svg" alt="部署状态"></a>
  <a href="https://github.com/nil-design/nil-design/issues"><img src="https://img.shields.io/github/issues/nil-design/nil-design" alt="Issues"></a>
  <a href="https://github.com/nil-design/nil-design/network/members"><img src="https://img.shields.io/github/forks/nil-design/nil-design" alt="Forks"></a>
  <a href="https://github.com/nil-design/nil-design/stargazers"><img src="https://img.shields.io/github/stars/nil-design/nil-design" alt="Stars"></a>
</p>

<p align="center">
  <a href="./README.md">English</a> · 简体中文
</p>

---

# Nil Design

多元 React 开发体系。

Nil Design 面向产品界面建设，提供基础 UI 原语、Hooks、图标、国际化、共享基础能力和工具链；你可以完整采用，也可以按包渐进接入。

## 为什么是 Nil Design

- 不止组件：组件之外，同步提供 Hooks、图标、国际化、共享工具和项目工具链。
- 组合优先：tokens、状态语义、slots 和 Tailwind CSS 入口让产品 UI 更稳定。
- 按需接入：各包独立发布，围绕少量共享基础协作。
- 贴近源码：API 表、示例和工具链来自同一个工作区。

## 包

| 包名 | 定位 |
| - | - |
| `@nild/components` | React UI 基础组件与组件样式入口。 |
| `@nild/hooks` | 受控状态、副作用、事件、refs、观察器、滚动锁定和计时等 Hooks。 |
| `@nild/icons` | `Icon`、`DynamicIcon`、图标 CSS，以及基于 IconPark 的单图标导入。 |
| `@nild/i18n` | 轻量国际化运行时，支持命名空间、语言回退、插件、插值和类型友好用法。 |
| `@nild/shared` | 共享类型、React helpers、工具函数、class 合并能力和 token 基础。 |
| `@nild/materials` | 规划中：面向完整体验模式的高层物料。 |

## 工具链

| 包名 | 定位 |
| - | - |
| `@nild/api-extractor` | 基于 Typedoc 的 API 抽取工具，服务文档和自动化流程。 |
| `@nild/eslint-plugin` | Nil Design 项目使用的本地 lint 规则。 |

## 安装

```sh
pnpm add @nild/components @nild/hooks @nild/icons @nild/shared
```

只需要某一类能力时，可以使用更小组合：

```sh
pnpm add @nild/hooks @nild/shared
pnpm add @nild/icons @nild/shared
pnpm add @nild/i18n @nild/shared
```

## 样式接入

```css
@import 'tailwindcss';
@import '@nild/components/tailwindcss';

@source '../node_modules/@nild/components/dist';
```

`@source` 路径按你的应用目录结构调整即可。

## 本地开发

```sh
pnpm install
pnpm docs:dev
pnpm build
pnpm typecheck
pnpm test
```

## 文档

- 文档首页：https://nil-design.github.io/nil-design/
- 快速开始：https://nil-design.github.io/nil-design/zh-CN/guide/quick-start.html
- 组件总览：https://nil-design.github.io/nil-design/zh-CN/components/
- Hooks：https://nil-design.github.io/nil-design/zh-CN/hooks/
- 包与依赖关系：https://nil-design.github.io/nil-design/zh-CN/guide/package-relationships.html

## 许可证

Apache License 2.0，详见 [LICENSE](./LICENSE)。
