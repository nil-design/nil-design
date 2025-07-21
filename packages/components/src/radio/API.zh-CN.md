### Radio Props

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

### Radio.Group Props

> 继承自 `Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| direction | - | `'horizontal' \| 'vertical'` | - |
| variant | - | `'solid' \| 'outlined'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| disabled | - | `boolean` | - |
| value | - | `T` | - |
| defaultValue | - | `T` | - |
| onChange | - | `(value: T) => void` | - |

### Radio.Indicator Props

> 继承自 `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `(checked: boolean) => ReactNode` | - |

### Radio.Label Props

> 继承自 `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `ReactNode \| (checked: boolean) => ReactNode` | - |
