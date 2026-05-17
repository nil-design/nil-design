# @nild/api-extractor

`@nild/api-extractor` 是一个 TypeDoc API 提取工具。它从 TypeScript 入口文件中收集导出项，输出稳定的 JSON schema，便于文档站、API 表格和自动化校验流程继续消费。

## 安装

```bash
pnpm add -D @nild/api-extractor typedoc typescript
```

`typedoc` 和 `typescript` 是 peer dependencies，需要由使用方项目提供。

## 基础用法

```ts
import { extractProject } from '@nild/api-extractor';

const project = await extractProject({
    cwd: process.cwd(),
    entryPoints: ['src/index.ts'],
    tsconfig: 'tsconfig.json',
});

console.log(project.items);
```

`extractProject` 会返回一个 `ApiProject`：

- `schemaVersion`：当前输出 schema 版本。
- `packageName`：从项目上下文中解析到的包名。
- `entryPoints`：参与提取的入口文件。
- `items`：导出的 API 项，包括组件、Hook、函数、常量、枚举、接口、类型别名、类和未知导出。
- `diagnostics`：缺失入口、未知导出等诊断信息。

## React 识别

工具会默认识别：

- 以大写字母开头的 React 组件。
- 以 `use` 加大写字母或数字开头的 Hook。
- `React.FC`、`forwardRef`、`memo`、`lazy` 等常见组件包装类型。
- 通过交叉类型挂载的复合组件。

可以通过 `reactComponents` 调整识别规则：

```ts
const project = await extractProject({
    entryPoints: ['src/index.ts'],
    reactComponents: {
        componentNamePattern: /^[A-Z]/,
        hookNamePattern: /^use[A-Z0-9]/,
        customComponentWrappers: [
            {
                name: 'StyledComponent',
                propsTypeArgumentIndex: 0,
                refTypeArgumentIndex: 1,
            },
        ],
        customHookClassifiers: [context => context.item.name.endsWith('HookFactory')],
    },
});
```

## 过滤与转换

`filters` 用于限制输出项，`transforms` 用于在输出前改写或移除条目：

```ts
const project = await extractProject({
    entryPoints: ['src/index.ts'],
    filters: {
        includeKinds: ['component', 'hook', 'function'],
        excludeTags: ['@internal'],
    },
    transforms: [
        item => ({
            ...item,
            name: `api:${item.name}`,
        }),
        item => (item.flags.deprecated ? undefined : item),
    ],
});
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `cwd` | 项目工作目录，默认使用 `process.cwd()`。 |
| `entryPoints` | 需要提取的入口文件列表。 |
| `tsconfig` | TypeScript 配置文件路径。 |
| `exclude` | 从 TypeDoc 项目中排除的 glob。 |
| `includePrivate` | 是否包含 private 成员。 |
| `includeProtected` | 是否包含 protected 成员。 |
| `includeExternalDeclarations` | 是否包含外部声明。 |
| `comments` | 控制 summary、block tags 和 modifier tags 是否写入输出。 |
| `reactComponents` | 控制 React 组件、Hook 和包装类型识别规则。 |
| `filters` | 按名称、类型、标签和来源路径过滤输出项。 |
| `transforms` | 在输出前改写或移除 API 项。 |
| `diagnostics` | 配置缺失入口和未知导出的诊断等级。 |

## Schema 类型

主入口会导出提取函数和全部接口类型：

```ts
import { extractProject } from '@nild/api-extractor';
import type { ApiItem, ApiProject, ExtractProjectOptions } from '@nild/api-extractor';
```

如果只需要稳定输出 schema，也可以从 `@nild/api-extractor/schema` 引入：

```ts
import type { ApiProject } from '@nild/api-extractor/schema';
```
