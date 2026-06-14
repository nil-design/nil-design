# Nil Design Agent Guide

进入 nil-design 仓库后，先按下面的全局规则执行；较长或包级的可复用流程见 `.agents/skills/*/SKILL.md` 和对应 `references/`。

## 仓库事实

- 本仓库是 pnpm monorepo，workspace 包含 `packages/**` 和 `tooling/**`。
- 根 `package.json` 要求 Node `>=20.18.0`，包管理器为 `pnpm@10.10.0`。
- 主要发布包包括 `@nild/components`、`@nild/hooks`、`@nild/shared`、`@nild/icons`、`@nild/i18n` 和 tooling 包。
- 文档站位于 `docs/`，基于 VitePress，主题扩展位于 `docs/.vitepress/theme/`。
- 主体说明使用中文；包名、命令、文件路径、API、TypeScript/React/VitePress 等关键术语保持英文原文。

## 工作入口

- 先以当前源码、配置、package scripts 和文档为事实源，再使用记忆或历史经验。
- 使用 `rg` / `rg --files` 搜索；读取中文 Markdown 或本地化文本时显式按 UTF-8 读取，不把终端乱码当成文件事实。
- 在混合工作区中只改当前任务需要的文件。遇到无关未跟踪或已修改文件时保留原样，除非用户明确要求处理。
- 用户收窄范围时，严格按收窄后的边界执行；格式清理不要顺手改内部缩进、示例内容或无关样式。

## 常用脚本

- 全局验证：`pnpm lint`、`pnpm lint:fix`、`pnpm typecheck`、`pnpm test`、`pnpm test:coverage`、`pnpm build`。
- 包构建与 API：`pnpm packages:build`、`pnpm api`。
- 文档站：`pnpm docs:dev`、`pnpm docs:build`、`pnpm docs:preview`、`pnpm docs:screenshot`。
- Components：`pnpm components:dev`、`pnpm components:test`、`pnpm components:build`、`pnpm components:api`。
- Hooks：`pnpm hooks:dev`、`pnpm hooks:build`。
- Shared：`pnpm shared:dev`、`pnpm shared:test`、`pnpm shared:build`。
- 其它包：`pnpm icons:dev`、`pnpm icons:build`、`pnpm icons:api`、`pnpm i18n:dev`、`pnpm i18n:test`、`pnpm i18n:build`、`pnpm eslint-plugin:build`。

## 技能路由

- `components-dev`：处理 `@nild/components` 组件源码、公开 API、组件测试、组件文档、组件 API 生成和组件总览。
- `hooks-dev`：处理 `@nild/hooks` React hooks、DOM target、observer/timer/storage 订阅、SSR/浏览器边界和 hooks 文档。
- `shared-dev`：处理 `@nild/shared` 类型、React helpers、class utilities、runtime utilities 和跨包基础能力。
- `docs-site-dev`：处理 VitePress 配置、主题覆盖、Layout、ReactLive、Mermaid、导航/侧边栏、搜索索引、截图脚本和 docs build 副作用。
- 跨边界任务先读对应技能，再按实际影响补读相关技能。例如组件公开 API 变化通常还会影响 docs-site 的 ReactLive 示例和搜索索引。

## 变更边界

- 公开入口、文档、API include、搜索索引、组件总览和 package exports 都是用户可见边界；内部目录或生成中间产物不是自动公开承诺。
- 新增或调整公开能力时，同步考虑源码入口、类型、测试、文档、生成产物和发布元数据；内部能力默认不扩散到公开文档。
- 抽象只在能减少真实重复、降低风险或表达稳定边界时提取；调用侧更清楚时保留局部实现。
- 视觉与交互改动遵循已有 ND tokens、VitePress 变量和语义化 utility，不随意引入 raw color、一次性变量或营销式装饰。

## 验证与产物

- 验证从聚焦命令开始，影响跨包或共享协议时再扩大到根级 `pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm test` 或 `pnpm test:coverage`。
- 视觉或交互体验变化按对应技能做浏览器/Playwright 验收，记录 viewport、theme 和关键交互状态。
- docs build 副作用按 `docs-site-dev` 处理；提交或恢复生成索引前先确认任务意图。
- 生成器可能产生无语义噪声。保留目标语义 diff，恢复 unrelated/no-op 生成 churn。
- release 或 changeset 工作先核对 `.changeset/config.json` 和相关 `CHANGELOG.md` 风格；本地待发布检查优先用 plain `pnpm changeset status`，不要依赖 `--since main`。
- Git hooks 可能通过 `lint-staged`、`eslint --fix`、`stylelint --fix` 或 `prettier --write` 改写 staged 文件；如果用户要求 commit/amend，提交后再检查 `git status --short` 和最新 commit diff。
