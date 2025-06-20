### Button Props

> 继承自 `ButtonHTMLAttributes<HTMLButtonElement>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| variant | - | `'solid' \| 'outlined' \| 'filled' \| 'text'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| shape | - | `'round' \| 'square'` | - |
| equal | - | `boolean` | - |
| disabled | - | `boolean` | - |
| block | - | `boolean` | - |

### Button.Group Props

> 继承自 `HTMLAttributes<HTMLDivElement>, Pick<ButtonProps, 'variant' | 'size' | 'disabled'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `ReactElement<ButtonProps, string \| JSXElementConstructor<any>> \| Array<ReactElement<ButtonProps, string \| JSXElementConstructor<any>>>` | - |
| direction | - | `'horizontal' \| 'vertical'` | - |
