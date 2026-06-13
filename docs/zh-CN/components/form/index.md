---
title: Form 表单
cat: 输入
---

# {{ $frontmatter.title }}

用于管理字段值、提交行为和基于 resolver 的校验结果。

## 值流

::: react-live
```tsx
import { Button, Field, Form, Input, Select } from '@nild/components';
import { useState } from 'react';

const Demo = () => {
  const [formValue, setFormValue] = useState({
    profile: {
      name: 'Nil Design',
      region: 'shanghai',
    },
  });

  return <div className="grid max-w-3xl gap-4 md:grid-cols-2">
    <Form defaultValue={formValue} onChange={setFormValue}>
      <Field name="profile.name">
        <Field.Label>项目名称</Field.Label>
        <Input block />
      </Field>
      <Field name="profile.region">
        <Field.Label>部署区域</Field.Label>
        <Select className="w-full" placeholder="选择区域">
          <Select.Option value="beijing" label="北京" />
          <Select.Option value="shanghai" label="上海" />
          <Select.Option value="shenzhen" label="深圳" />
        </Select>
      </Field>
      <Form.Actions>
        <Button type="submit">保存</Button>
      </Form.Actions>
    </Form>
    <pre className="m-0 overflow-auto rounded-sm bg-subtle p-3 text-sm text-main">
      {JSON.stringify(formValue, null, 2)}
    </pre>
  </div>;
}

render(<Demo />);
```
:::

## 校验

::: react-live
```tsx
import { Button, Field, Form, Input } from '@nild/components';
import { useState } from 'react';

const resolver = value => {
  const errors = {};
  const warnings = {};

  if (!value.email) {
    errors.email = '请输入邮箱。';
  } else if (!String(value.email).includes('@')) {
    errors.email = '邮箱格式不正确。';
  }

  if (value.alias && String(value.alias).length < 3) {
    warnings.alias = '别名较短，可能不易识别。';
  }

  return { errors, warnings };
};

const Demo = () => {
  const [notice, setNotice] = useState('尚未提交');

  return <div className="flex w-96 flex-col gap-4 text-md">
    <Form
      resolver={resolver}
      onInvalid={errors => setNotice(`请修正：${Object.keys(errors)[0]}`)}
      onSubmit={value => setNotice(`已提交：${value.email}`)}
    >
      <Field name="email" required>
        <Field.Label>邮箱</Field.Label>
        <Input block placeholder="you@example.com" />
        <Field.Status />
      </Field>
      <Field name="alias">
        <Field.Label>公开别名</Field.Label>
        <Input block placeholder="Nil" />
        <Field.Status />
      </Field>
      <Form.Actions>
        <Button type="submit">提交</Button>
      </Form.Actions>
    </Form>
    <span className="text-subtle">{notice}</span>
  </div>;
}

render(<Demo />);
```
:::

## 混合控件

::: react-live
```tsx
import { Button, Checkbox, Field, Form, Switch } from '@nild/components';
import { useState } from 'react';

const Demo = () => {
  const [formValue, setFormValue] = useState({
    modules: ['audit'],
    notification: true,
  });

  return <div className="flex w-96 flex-col gap-4">
    <Form defaultValue={formValue} onChange={setFormValue} onSubmit={value => setFormValue(value)}>
      <Field name="modules">
        <Field.Label>启用模块</Field.Label>
        <Checkbox.Group direction="vertical">
          <Checkbox value="audit">审计日志</Checkbox>
          <Checkbox value="billing">账单中心</Checkbox>
          <Checkbox value="members">成员管理</Checkbox>
        </Checkbox.Group>
      </Field>
      <Field name="notification" bind="checked">
        <Field.Label>邮件通知</Field.Label>
        <Switch />
        <Field.Helper>布尔控件通过 bind="checked" 绑定。</Field.Helper>
      </Field>
      <Form.Actions>
        <Button type="submit">应用</Button>
      </Form.Actions>
    </Form>
    <pre className="m-0 rounded-sm bg-subtle p-3 text-sm text-main">
      {JSON.stringify(formValue, null, 2)}
    </pre>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/form/API.zh-CN.md-->
