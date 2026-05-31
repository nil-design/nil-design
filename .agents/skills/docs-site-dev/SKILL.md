---
name: docs-site-dev
description: "用于 nil-design 仓库中文档站开发、重构和维护，包括 VitePress 配置、主题覆盖、Layout 扩展、自定义 Vue/React 文档组件、ReactLive、Mermaid、导航/侧边栏生成、搜索索引、截图脚本和 docs build 副作用。"
---

# 开发文档站

用于 nil-design 的 `docs/`、VitePress 配置、主题层和文档站功能。先核对当前配置、主题入口和目标组件，再按以下维护偏好改动。

## 第一轮核对

- 配置或路由变化先读 `docs/.vitepress/config.js` 和 `docs/.vitepress/getThemeConfig.js`。
- 主题入口或全局组件变化先读 `docs/.vitepress/theme/index.js`、当前 Layout 扩展和目标组件。
- 改视觉前读 `docs/.vitepress/theme/index.css` 和 `packages/components/src/tailwind.css`。
- 覆盖默认主题 DOM、变量或滚动条时读 `references/theme-overrides.md`；需要完整 `--vp-*` 父子引用链、最小覆盖根或未声明扩展钩子时读 `references/variable-tree.md`。
- 如果 VitePress 版本升级或默认主题行为异常，优先核对当前安装的默认主题源码，再决定是否刷新 `variable-tree.md`。
- 改截图脚本或视觉验收流程时读 `references/screenshot.md`。

## 主题与布局

- 除非任务明确要求替换主题，否则继续扩展 VitePress `DefaultTheme`。
- 覆盖层级优先级：VP 变量、稳定 CSS selector、Layout slots、全局组件注册、局部替换默认主题组件，最后才考虑 fork 默认主题。
- 主题 CSS 只放变量、基础页面环境、默认主题结构覆盖和跨区域共享样式；自定义组件私有样式留在组件边界内。
- 优先使用 ND tokens、VP 变量桥接和语义化 Tailwind utility；raw color 和一次性变量要有明确理由。
- 文档 UI 服务阅读、扫描、示例运行和导航，不用营销页面式装饰覆盖工具性信息。

## 内容、导航与示例

- 导航和侧边栏由 locale 目录、Markdown frontmatter 和主题配置生成；正常文档页不要手写 sidebar。
- 文档 frontmatter 是路由、标题、分类和排序的事实源；修改导航行为前先读生成代码。
- ReactLive 示例必须以当前 import scope 为准；写前从实现代码核对可用导入范围。
- 自定义 Markdown 扩展、Mermaid、React/Vue bridge 或搜索索引变动都属于 docs build 影响面。

## 验证

- 配置和脚本先跑语法检查或目标 eslint。
- 路由、Markdown、主题注册或搜索索引变化运行 `pnpm docs:build`。
- 视觉变化启动 docs dev server，用浏览器截图确认桌面/移动和 light/dark。
- `docs:build` 可能刷新搜索索引；除非任务就是更新索引，否则把意外索引 diff 当作构建副作用处理。
