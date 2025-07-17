### Switch Props

> 继承自 `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| variant | - | `'solid' \| 'outlined'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| shape | - | `'round' \| 'square'` | - |
| checked | - | `boolean` | - |
| defaultChecked | - | `boolean` | - |
| value | - | `boolean` | - |
| defaultValue | - | `boolean` | - |
| disabled | - | `boolean` | - |
| onChange | - | `(checked: boolean) => void` | - |

### Switch.Thumb Props

> 继承自 `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `(checked: boolean) => ReactNode` | - |

### Switch.Track Props

> 继承自 `HTMLAttributes<HTMLDivElement>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| type* | - | `'checked' \| 'unchecked'` | - |
