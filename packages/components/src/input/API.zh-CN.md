### Input Props

> 继承自 `Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| variant | - | `'outlined' \| 'filled'` | - |
| size | - | `'small' \| 'medium' \| 'large'` | - |
| block | - | `boolean` | - |
| disabled | - | `boolean` | - |
| value | - | `string \| number` | - |
| defaultValue | - | `string \| number` | - |
| onChange | - | `(value: string \| number, evt: ChangeEvent<HTMLInputElement>) => void` | - |

### Input.Append Props

> 等价于 `HTMLAttributes<HTMLDivElement>`

### Input.Number Props

> 继承自 `Omit<InputProps, 'value' | 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| value | - | `number` | - |
| defaultValue | - | `number` | - |
| onChange | - | `(value: undefined \| number, evt?: ChangeEvent<HTMLInputElement>) => void` | - |
| min | - | `number` | - |
| max | - | `number` | - |
| step | - | `number` | - |

### Input.OTP Props

> 继承自 `InputProps`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| length | - | `number` | - |
| onComplete | - | `(value: string) => void` | - |

### Input.Password Props

> 继承自 `Omit<InputProps, 'value' | 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| value | - | `string` | - |
| defaultValue | - | `string` | - |
| onChange | - | `(value: string, evt: ChangeEvent<HTMLInputElement>) => void` | - |
| visible | - | `boolean` | - |
| defaultVisible | - | `boolean` | - |
| onVisibleChange | - | `(visible: boolean) => void` | - |

### Input.Prefix Props

> 等价于 `HTMLAttributes<HTMLSpanElement>`

### Input.Prepend Props

> 等价于 `HTMLAttributes<HTMLDivElement>`

### Input.Search Props

> 继承自 `Omit<InputProps, 'value' | 'defaultValue' | 'onChange'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| value | - | `string` | - |
| defaultValue | - | `string` | - |
| keyword | - | `string` | - |
| defaultKeyword | - | `string` | - |
| onChange | - | `(value: string, evt: ChangeEvent<HTMLInputElement>) => void` | - |
| onSearch | - | `(value: string) => void` | - |

### Input.Suffix Props

> 等价于 `HTMLAttributes<HTMLSpanElement>`
