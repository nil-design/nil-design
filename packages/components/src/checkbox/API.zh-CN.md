### Checkbox Props

> 继承自 `Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| variant | - | `'solid' \| 'outlined'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| disabled | - | `boolean` | - |
| checked | - | `boolean` | - |
| defaultChecked | - | `boolean` | - |
| value | - | `unknown` | - |
| onChange | - | `(checked: boolean) => void` | - |

### Checkbox.Group Props

> 继承自 `Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| direction | - | `'horizontal' \| 'vertical'` | - |
| variant | - | `'solid' \| 'outlined'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| disabled | - | `boolean` | - |
| value | - | `Array<T>` | - |
| defaultValue | - | `Array<T>` | - |
| onChange | - | `(value: Array<T>) => void` | - |

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
