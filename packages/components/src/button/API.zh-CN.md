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

> 继承自 `HTMLAttributes<HTMLDivElement>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| direction | - | `'horizontal' \| 'vertical'` | - |
| variant | - | `'solid' \| 'outlined' \| 'filled' \| 'text'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| disabled | - | `boolean` | - |
| children | - | `ReactElement<ButtonProps, string \| JSXElementConstructor<any>> \| Array<ReactElement<ButtonProps, string \| JSXElementConstructor<any>>>` | - |
