# 文档站维护模式

## VitePress 配置

- 配置文件定义 base、locales、theme config、search、Vite plugins、Markdown plugins 和 build 钩子；改其中任一项都要确认 docs build 副作用。
- locale 首页 frontmatter 决定导航入口；子文档 frontmatter 决定 sidebar 分类和排序。
- 站点 base、搜索索引、sitemap、analytics 或 public 复制逻辑都可能区分 dev/prod，改动前先读当前条件判断。

## Theme 入口

- Theme 入口负责扩展默认主题、注册全局组件和引入主题 CSS。
- Layout 扩展适合挂载全局 chrome、provider、进度条、徽标、首页替换块或页面外层容器。
- 自定义 Vue/React 组件应保持清晰边界，消费主题层变量但不把私有布局塞进全局 CSS。

## ReactLive 与 Markdown

- ReactLive import scope 从代码确认，示例导入范围以当前实现为准。
- 示例应短小、可运行、贴近组件真实用法；需要 state 时在示例中显式写出。
- 清理 ReactLive 示例 spacing 时尊重用户给出的收窄范围。若只要求外层/实例组容器，默认只把外层容器统一到 `gap-4`，不顺手改内部 JSX、缩进或示例内容。
- 示例说明和值文本默认使用 `text-md`，不加 `text-muted` 或 `text-main`；默认文档字色已经足够。只有示例目标是文字层级、颜色或状态时才加颜色 utility。
- 展示 block-level、宽度或填充行为时，先判断容器宽度是否是示例重点；不是重点时避免不必要的 `max-w-*`。
- 组件文档章节按用户可感知场景组织，新增或重排前参考已有组件文档的顺序。
- Markdown 插件会影响 build 和渲染安全，新增语法前要确认服务端构建和客户端 hydration 都成立。
