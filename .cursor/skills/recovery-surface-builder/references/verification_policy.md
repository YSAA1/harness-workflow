# Verification entry
优先复用已存在、适用于目标平台的真实检查命令。只有确需统一入口时生成脚本；Windows 可以使用 PowerShell、Python 或 Node，不强制 Bash。
检查须真正执行目标行为并传播失败退出码；仅 echo 计划不能证明成功。长脚本和关键词是审查信号，不是自动失败。
结构/语法检查只证明结构，行为声明需要对应运行证据。fresh evidence 可复用至相关代码、环境或输入改变。
选 harness backend 才检查相应 .harness 产物；已有 backend 不以固定目录列表判失败。
