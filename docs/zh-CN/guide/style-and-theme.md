---
title: 样式与动态主题
order: 1
cat: 定制
catOrder: 2
---

# {{ $frontmatter.title }}

本页说明组件样式入口、Tailwind 扫描配置、主题变量和明暗模式。包依赖关系见 [包与依赖关系](./package-relationships.md)。

## 样式入口

推荐在应用的全局 CSS 中显式引入 `@nild/components/tailwindcss`：

```css
@import 'tailwindcss';
@import '@nild/components/tailwindcss';

@source '../node_modules/@nild/components/dist';
```

`@source` 用于让 Tailwind v4 扫描组件产物中的 class。路径需要根据全局 CSS 文件与 `node_modules` 的相对位置调整。

## 主题变量

品牌色、中性色与状态色的种子变量如下：

| 变量 | 作用 |
| - | - |
| `--nd-brand-h` | 品牌色相，也是中性色轻微染色方向。 |
| `--nd-brand-c` | 品牌色彩度。 |
| `--nd-neutral-c` | 中性色彩度。 |

这些变量派生出 `--nd-color-brand-*`、`--nd-color-neutral-*`，再映射到 `--color-brand`、`--background-color-canvas`、`--text-color-main` 等 Tailwind 语义 token。

### 色盘预览

::: react-live
```tsx
const levels = ['0', '5', '10', '15', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

const palettes = [
  {
    title: '品牌色',
    colors: levels.map(level => ({
      label: level,
      token: `--nd-color-brand-${level}`,
    })),
  },
  {
    title: '中性色',
    colors: levels.map(level => ({
      label: level,
      token: `--nd-color-neutral-${level}`,
    })),
  },
  {
    title: '状态色',
    colors: [
      { label: 'Success', token: '--color-success' },
      { label: 'Warning', token: '--color-warning' },
      { label: 'Error', token: '--color-error' },
    ],
  },
];

const Demo = () => {
  return <div className="space-y-6">
    {palettes.map(({ title, colors }) => (
      <section key={title}>
        <h3 className="m-0 text-md font-semibold text-main">{title}</h3>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {colors.map(({ label, token }) => {
            return <div key={token} className="overflow-hidden rounded-md bg-canvas shadow-sm">
              <div className="h-12" style={{ backgroundColor: `var(${token})` }} />
              <div className="space-y-0.5 px-2 py-1.5">
                <div className="text-sm font-medium text-main">{label}</div>
                <div className="break-all text-sm leading-tight text-subtle">{token}</div>
              </div>
            </div>;
          })}
        </div>
      </section>
    ))}
  </div>;
};

render(<Demo />);
```
:::

### 覆盖方式

全局默认主题可以在组件样式入口之后覆盖变量。这里的“编译时覆盖”指覆盖代码随应用 CSS 一起构建发布：

```css
@import 'tailwindcss';
@import '@nild/components/tailwindcss';

@source '../node_modules/@nild/components/dist';

:root {
  --nd-brand-h: 255;
  --nd-brand-c: 0.13;
  --nd-neutral-c: 0.006;
}
```

需要按用户、租户或配置动态切换时，可以在运行时写入根节点或主题容器：

```ts
const themeRoot = document.documentElement;

themeRoot.style.setProperty('--nd-brand-h', '255');
themeRoot.style.setProperty('--nd-brand-c', '0.13');
themeRoot.style.setProperty('--nd-neutral-c', '0.006');
```

CSS 变量会向下继承。把变量写到局部容器上，可以让容器内部的 Nil Design 组件使用局部主题。

## 明暗模式

组件 token 使用 `light-dark()` 描述明暗两套颜色。应用如果自行实现暗色切换，需要确保根节点或主题容器设置了正确的 `color-scheme`：

```css
:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}
```

背景、文字、边框、阴影和状态色会随当前 color scheme 取值。
