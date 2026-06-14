# 组件文档与 API

## API 生成

- Components API 由包内生成脚本从组件入口和 Typedoc 信息生成；不要手工维护结构列。
- `API.zh-CN.md` 是半托管产物：属性名、类型、默认值和继承关系由生成器写入，中文“描述”列允许人工维护并应在再生成后保留。
- “描述”列保持短句风格；上下文明确时省略组件名和“是否”等冗余词，只保留受控/默认值、回调时机、等价关系和使用约束。
- 如果 API 表缺少主组件或公开子组件，先查目录入口、`@category Components`、复合导出结构和类型可见性，不要直接补 Markdown 表格。
- 新增公开组件、props 变化、公开子组件变化或新增 API include 时运行 `pnpm components:api`。
- `components:api` 可能带出 unrelated/no-op API Markdown churn；恢复无语义噪声，只保留目标组件或目标 API 的真实 diff。
- Icon 文档的 API 来自 icons 包；图标公开 API 变化运行 `pnpm icons:api`。

## 文档页

- 公开组件文档位于 `docs/zh-CN/components/<component>/index.md`。
- Frontmatter 至少包含 `title` 和 `cat`；`cat` 使用文档站已有分类，只在需要排序时加入排序字段。
- 标题使用 `# {{ $frontmatter.title }}`，首段用一句中文说明用途。
- 章节按用户可感知场景组织，例如基础用法、变体、尺寸、状态、组合、自定义内容、特殊能力。
- 新组件或重排章节时先参考相邻已有组件文档的语义顺序；不要把变体、尺寸、状态等高频场景混进一个首节。
- 示例使用 `react-live`，导入范围以当前 ReactLive 实现为准，写前从代码核对。
- 示例布局优先使用 Tailwind 预设刻度；portal 或浮层示例按需使用 `vp-raw` 避免文档样式污染。
- 支持内部节点扩展时展示 slot 子组件写法，不优先展示节点注入 props。
- 页末使用 vitepress 的 include 语法引入 API.md/API.\*.md，不额外维护 API 表。
- 示例文字、ReactLive 间距和 docs build 副作用遵循 `docs-site-dev`；组件文档只补组件契约事实。

## 组件总览

- 新增公开组件文档页时同步维护组件总览：Markdown 卡片数据、组件总览渲染映射、以及 120 by 80 的组件剪影 SVG。
- 剪影 SVG 使用 ND token CSS 变量，表达可识别的组件轮廓或典型场景；不要放文字、渐变或截图式细节。
- 总览的组件卡片顺序默认参照文档左侧导航的组件顺序排列。
