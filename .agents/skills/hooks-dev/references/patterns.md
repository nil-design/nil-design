# Hook 模式参考

## 状态与回调

- `useState` 管理会影响渲染的数据；`useRef` 管理不需要触发渲染的 mutable 值。
- 需要在订阅回调中读取最新用户 callback 时，使用 latest-ref，而不是把 callback 放进绑定依赖导致频繁解绑。
- 函数式 updater 用于避免 callback 依赖当前 state，同时保持更新语义清晰。

## 副作用绑定

- event listener、observer、timer、storage listener、scroll lock 等都要有明确 cleanup。
- 使用 binding ref 记录当前绑定目标和关键 options；未变化时避免重复解绑/重绑。
- options 比较要聚焦真正影响绑定的字段，不要用不稳定对象引用制造重复副作用。

## Target 解析

- DOM target 支持直接对象、nullable 值和 ref object。
- 多 target 场景需要去重并保持顺序，便于稳定比较。
- 浏览器 API 不存在时要安全跳过或使用明确 fallback。

## 测试

- 每个测试隔离 globals、timers、DOM styles 和 mocked constructors。
- DOM hooks 使用 jsdom 环境；纯 hooks 保持普通测试环境即可。
- 断言公开行为和 cleanup 结果，不断言内部 ref 字段。