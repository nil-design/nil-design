### Checkbox Props

> 继承自 `Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| variant | - | `'solid' \| 'outlined'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| checked | - | `boolean` | - |
| defaultChecked | - | `boolean` | - |
| value | - | `boolean` | - |
| defaultValue | - | `boolean` | - |
| indeterminate | - | `boolean` | - |
| disabled | - | `boolean` | - |
| onChange | - | `(checked: boolean) => void` | - |

### Checkbox.Indicator Props

> 继承自 `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `(checked: boolean) => ReactNode` | - |

### Checkbox.Label Props

> 继承自 `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `ReactNode \| (checked: boolean) => ReactNode` | - |
