# Windows UTF-8 背景

## 为什么重要

Codex 在 Windows 上可能通过 Windows PowerShell 5.1 执行命令。在中文/CJK Windows locale 下，裸 `Get-Content` 可能用系统 ANSI code page 读取 UTF-8 without BOM 文件，从而产生乱码。模型拿到的已经是损坏后的文本，之后会“自信地”基于错误内容推理。

## 参考来源

- OpenAI Codex issue：<https://github.com/openai/codex/issues/23044>
- Microsoft PowerShell 编码文档：<https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding>
- 社区 guardrail skill：<https://github.com/chianwu-hash/windows-powershell-encoding-skill>

## 实用检查

显式 UTF-8 读取：

```powershell
Get-Content -Encoding UTF8 -Raw -Path .\path\to\file.md
```

终端输出可疑时检查字节：

```powershell
Format-Hex -Path .\path\to\file.md
```

连续执行文本敏感命令时设置 session：

```powershell
chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
```
