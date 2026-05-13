### Form Props

> 继承自 `Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'defaultValue' | 'onChange' | 'onInvalid' | 'onSubmit'>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `ReactNode` | - |
| defaultValue | - | `Record<string, unknown>` | - |
| resolver | - | `(value: Record<string, unknown>) => FormResolverResult \| Promise<FormResolverResult>` | - |
| validateTrigger | - | `'change' \| 'submit' \| Array<'change' \| 'submit'>` | - |
| onChange | - | `(value: Record<string, unknown>) => void` | - |
| onInvalid | - | `(errors: Record<string, ReactNode \| { message: ReactNode } \| Array<ReactNode \| { message: ReactNode }> \| undefined>, value: Record<string, unknown>, evt: FormEvent<HTMLFormElement>) => void` | - |
| onSubmit | - | `(value: Record<string, unknown>, evt: FormEvent<HTMLFormElement>) => void \| Promise<void>` | - |
| disabled | - | `boolean` | - |

### Form.Actions Props

> 继承自 `HTMLAttributes<HTMLDivElement>`

| 属性名 | 描述 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| children | - | `ReactNode` | - |
