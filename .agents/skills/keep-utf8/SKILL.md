---
name: keep-utf8
description: "用于 Windows、PowerShell、Codex shell 或跨平台脚本中读取、写入、检查和验证 UTF-8 / 非 ASCII 文本，尤其是中文/CJK、Markdown、本地化表格、生成文本和乱码诊断；防止把终端渲染乱码误认为真实文件内容。"
---

# 避免乱码

当 shell、Windows、PowerShell、Codex 工具输出和非 ASCII 文本同时出现时使用这个技能。

## 核心规则

终端显示不是文本事实源。如果中文/CJK 或其它非 ASCII 看起来异常，先验证文件字节、显式 UTF-8 读取结果或渲染结果，再编辑、总结或提交。

## PowerShell 默认值

文本敏感命令优先设置当前 session：

```powershell
chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
```

优先使用 PowerShell 7+。Windows PowerShell 5.1 读取 BOM-less UTF-8 时更容易受系统 ANSI code page 影响。

## 读取文件

- 避免裸 `cat`、裸 `type`、裸 `Get-Content` 读取非 ASCII 文本。
- 文本文件使用 `Get-Content -Encoding UTF8 -Raw -Path <file>`。
- `rg` 适合搜索；当精确中文内容重要时，再用显式 UTF-8 读取确认。
- 输出异常时用 `Format-Hex`、`git diff`、浏览器渲染或结构化解析器交叉验证。

## 写入文件

- 源码手工编辑优先使用 `apply_patch`。
- 批量生成或脚本写入非 ASCII 文本时，显式使用 UTF-8 without BOM，并写后重新显式读取验证。
- 不把终端乱码复制回源码。
- 避免 PowerShell heredoc、重定向、`Out-File`、`Set-Content`、`Add-Content` 直接写非 ASCII，除非显式指定编码并验证。
- 脚本里必须包含本地化文本时，优先放 UTF-8 数据文件；无法避免时使用明确编码转换。

## 诊断乱码

- 先区分“文件内容损坏”和“终端显示损坏”。
- 检查文件是否 UTF-8 without BOM、shell 是否 Windows PowerShell 5.1、外部工具是否按当前 code page 输出。
- 需要背景、参考链接和复现场景时读 `references/background.md`。