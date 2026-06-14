# 文档截图验证

维护 docs 截图脚本和视觉验收流程时，按以下规则执行。

## 使用原则

- 截图脚本是验证工具，不是源代码生成器；输出默认视为一次性本地验证产物。
- 脚本应从当前文档结构推导 routes，不硬编码易漂移页面列表，除非是明确的验收样本。
- 主题色、模式、viewport、路由进入方式和交互状态都要可复现。
- 视觉 diff 需要说明截图路径、模式、viewport 和关键交互状态；视觉 polish 优先保留 before/after。

## 常用检查

```powershell
node --check scripts/docs-screenshot.js
pnpm exec eslint scripts/docs-screenshot.js
pnpm docs:screenshot -- --mode light
```

## 验收重点

- light/dark 模式都应稳定。
- 组件页截图应进入目标交互状态后再捕获。
- 浮层、transition 或 portal 场景要验证 visible/hidden、focus 和可交互状态，不只看节点是否还在 DOM 中。
- route 切换、主题切换、localStorage/sessionStorage seed 和 CSS 变量注入都要有明确生命周期。
- 生成输出不要和需要提交的源文件混在一起。
