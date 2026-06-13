---
title: 组件
navOrder: 2
---

<script setup>
const componentCards = [
    { slug: 'button', title: 'Button 按钮' },
    { slug: 'icon', title: 'Icon 图标' },
    { slug: 'typography', title: 'Typography 排版' },
    { slug: 'divider', title: 'Divider 分割线' },
    { slug: 'tabs', title: 'Tabs 标签页' },
    { slug: 'checkbox', title: 'Checkbox 复选框' },
    { slug: 'color-picker', title: 'ColorPicker 颜色选择器' },
    { slug: 'field', title: 'Field 字段' },
    { slug: 'form', title: 'Form 表单' },
    { slug: 'input', title: 'Input 输入框' },
    { slug: 'radio', title: 'Radio 单选框' },
    { slug: 'segment', title: 'Segment 分段控制器' },
    { slug: 'select', title: 'Select 选择器' },
    { slug: 'slider', title: 'Slider 滑块' },
    { slug: 'switch', title: 'Switch 开关' },
    { slug: 'modal', title: 'Modal 模态框' },
    { slug: 'popover', title: 'Popover 气泡卡片' },
    { slug: 'tooltip', title: 'Tooltip 提示' },
    { slug: 'watermark', title: 'Watermark 水印' },
    { slug: 'alert', title: 'Alert 警告提示' },
    { slug: 'transition', title: 'Transition 过渡' },
];
</script>

# 总览

Nil Design 为 Web 应用提供了丰富的基础 UI 组件。

<ComponentCatalog :items="componentCards" />
