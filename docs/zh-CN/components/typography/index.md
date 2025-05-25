---
title: Typography 排版
category: 通用
order: 3
---

# Typography 排版

展示文本内容。

## 标题

::: react-live
```tsx
const { Title } = Typography;
const Demo = () => {
  return <div>
    <Title>h1. Nil Design</Title>
    <Title level={2}>h2. Nil Design</Title>
    <Title level={3}>h3. Nil Design</Title>
    <Title level={4}>h4. Nil Design</Title>
    <Title level={5}>h5. Nil Design</Title>
    <Title level={6}>h6. Nil Design</Title>
  </div>;
}

render(<Demo />);
```
:::

## 文本

::: react-live
```tsx
const { Text } = Typography;
const Demo = () => {
  return <div className="flex flex-col items-start gap-4 text-[length:var(--nd-font-size-md)]">
    <Text>Nil Design</Text>
    <Text secondary>Nil Design</Text>
    <Text disabled>Nil Design</Text>
    <Text strong>Nil Design</Text>
    <Text del>Nil Design</Text>
    <Text u>Nil Design</Text>
    <Text i>Nil Design</Text>
    <Text mark>Nil Design</Text>
    <Text code>Nil Design</Text>
    <Text kbd>Nil Design</Text>
  </div>;
}

render(<Demo />);
```
:::

## 段落

::: react-live
```tsx
const { Title, Paragraph, Text } = Typography;
const Demo = () => {
  return (
    <Typography>
      <Title>荷塘月色</Title>
      <Text>朱自清</Text>
      <Title level={2}>荷塘</Title>
      <Paragraph>曲曲折折的荷塘上面，弥望的是田田的叶子。叶子出水很高，<Text mark>像亭亭的舞女的裙</Text>。层层的叶子中间，零星地点缀着些白花，有袅娜地开着的，有羞涩地打着朵儿的；正如一粒粒的明珠，又如碧天里的星星，又如刚出浴的美人。</Paragraph>
      <Paragraph>微风过处，送来缕缕清香，<Text mark>仿佛远处高楼上渺茫的歌声似的</Text>。这时候叶子与花也有一丝的颤动，像闪电般，霎时传过荷塘的那边去了。叶子本是肩并肩密密地挨着，这便宛然有了一道凝碧的波痕。</Paragraph>
      <Title level={2}>月色</Title>
      <Paragraph>月光如流水一般，静静地泻在这一片叶子和花上。薄薄的青雾浮起在荷塘里。叶子和花<Text mark>仿佛在牛乳中洗过一样；又像笼着轻纱的梦</Text>。虽然是满月，天上却有一层淡淡的云，所以不能朗照；但我以为这恰是到了好处——酣眠固不可少，小睡也别有风味的。</Paragraph>
      <Paragraph>月光是隔了树照过来的，高处丛生的灌木，落下参差的斑驳的黑影，峭楞楞如鬼一般；弯弯的杨柳的稀疏的倩影，却又像是画在荷叶上。塘中的月色并不均匀；但光与影有着和谐的旋律，如梵婀玲上奏着的名曲。</Paragraph>
    </Typography>
  );
}

render(<Demo />);
```
:::

## Typography.Title API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| children | - | `React.ReactNode` | - |
| level | - | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` |

## Typography.Text API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| children | - | `React.ReactNode` | - |
| disabled | - | `boolean` | - |
| secondary | - | `boolean` | - |
| strong | - | `boolean` | - |
| del | - | `boolean` | - |
| u | - | `boolean` | - |
| i | - | `boolean` | - |
| mark | - | `boolean` | - |
| code | - | `boolean` | - |
| kbd | - | `boolean` | - |

## Typography.Paragraph API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| children | - | `React.ReactNode` | - |
