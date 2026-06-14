---
name: docs-site-dev
description: '处理 nil-design 仓库中文档站开发、重构和维护，包括 VitePress 配置、主题覆盖、Layout 扩展、自定义 Vue/React 文档组件、ReactLive、Mermaid、导航/侧边栏生成、搜索索引、截图脚本和 docs build 副作用。'
---

# 开发文档站

处理 nil-design 的 `docs/`、VitePress 配置、主题层和文档站功能时，按下面的职责边界、核对清单、主题布局、内容示例和验证要求推进。

## 职责边界

- 优先负责 `docs/**`、`docs/.vitepress/**`、文档站主题组件、Markdown 扩展、搜索索引和截图验收流程。
- 文档示例必须回到当前源码确认；涉及包契约时按根 `AGENTS.md` 的技能路由补读相关技能。
- 文档站 UI 服务阅读、扫描、示例运行和导航，不做营销页面式装饰。

## 第一轮核对

- 配置或路由变化先读 `docs/.vitepress/config.js` 和 `docs/.vitepress/getThemeConfig.js`。
- 主题入口或全局组件变化先读 `docs/.vitepress/theme/index.js`、当前 Layout 扩展和目标组件。
- 改视觉前读 `docs/.vitepress/theme/index.css` 和 `packages/components/src/tailwind.css`。
- 覆盖默认主题 DOM、变量或滚动条时读 `references/theme-overrides.md`；需要完整 `--vp-*` 父子引用链、最小覆盖根或未声明扩展钩子时读 `references/variable-tree.md`。
- 如果 VitePress 版本升级或默认主题行为异常，优先核对当前安装的默认主题源码，再决定是否刷新 `variable-tree.md`。
- 改截图脚本或视觉验收流程时读 `references/screenshot.md`。
- 改 ReactLive、Markdown 插件、导航生成或搜索索引时读 `references/patterns.md`。

## 主题与布局

- 除非任务明确要求替换主题，否则继续扩展 VitePress `DefaultTheme`。
- 覆盖层级优先级：VP 变量、稳定 CSS selector、Layout slots、全局组件注册、局部替换默认主题组件，最后才考虑 fork 默认主题。
- 主题 CSS 只放变量、基础页面环境、默认主题结构覆盖和跨区域共享样式；自定义组件私有样式留在组件边界内。
- 优先使用 ND tokens、VP 变量桥接和语义化 Tailwind utility；raw color 和一次性变量要有明确理由。

## 内容、导航与示例

- 导航和侧边栏由 locale 目录、Markdown frontmatter 和主题配置生成；正常文档页不要手写 sidebar。
- 文档 frontmatter 是路由、标题、分类和排序的事实源；修改导航行为前先读生成代码。
- ReactLive 示例必须以当前 import scope 为准；写前从实现代码核对可用导入范围。
- ReactLive 示例清理要尊重用户收窄的范围；示例组外层容器默认用 `gap-4`，不要顺手改内部缩进、内容或无关 spacing。
- 组件文档章节语义顺序参考相邻已有组件文档，按基础用法、变体、尺寸、状态、组合、自定义内容、特殊能力等用户可感知场景组织。
- 文档示例里的说明和值文本默认使用 `text-md`，不额外加颜色；文档默认字色已经是 `text-main`。只有示例本身在展示文字层级或颜色时才加颜色 utility。
- 展示组件 block-level 属性或尺寸行为时，避免给容器加不必要的 `max-w-*`，除非宽度约束本身就是示例重点。
- 自定义 Markdown 扩展、Mermaid、React/Vue bridge 或搜索索引变动都按 docs build 影响面处理。

## 验证

- 配置和脚本先跑语法检查或目标 eslint。
- 路由、Markdown、主题注册或搜索索引变化运行 `pnpm docs:build`。
- 视觉变化启动 docs dev server，用浏览器截图确认桌面/移动和 light/dark。
- `docs:build` 会刷新 `docs/public/indexes/en-US.json`、`docs/public/indexes/manifest.json` 和 `docs/public/indexes/zh-CN.json`；这些索引是正常副作用，按任务意图保留或恢复。
- VitePress chunk-size warning 通常是非阻塞 warning；除非伴随构建失败或异常体积变化，不按失败处理。
