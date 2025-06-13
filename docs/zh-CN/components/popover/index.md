---
title: Popover 气泡卡片
order: 1
cat: 展示
catOrder: 4
---

# Popover 气泡卡片

弹窗展示额外信息。

## 触发方式

::: react-live
```tsx
const { Text } = Typography;
const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Popover action="hover">
      <Button>Hover me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
    <Popover action="focus">
      <Button variant="outlined">Focus me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
    <Popover>
      <Button variant="filled">Click me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
    <Popover action="contextMenu">
      <Button variant="text">Right-click me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
  </div>;
}

render(<Demo />);
```
:::