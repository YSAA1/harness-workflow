# Current task

Objective: 落地恢复面闭环批2：退休契约写进 AGENTS.md 主落点与 plan/ship/cleanup 补充落点，recovery_surface_policy 补生命周期合同与 lessons 写法纪律，分发机制接入 harness-builder 模板与 plan 建档指针。
Worktree: 本仓 master。
Status: active
Primary artifact: docs/specs/2026-09-18--recovery-surface-loop.md
Evidence: 批2 已接线：AGENTS.md 恢复面节补写侧纪律 4 条（增量 6 行，含翻行即退休四步、删除前置＋入度守卫、可达性活判据、check-plugin 闸门）；plan 第 5 步指针行携带最小写侧纪律＋worktree 说明；harness-builder 第 5 步声明分发要求，AGENTS.md.j2 Recovery 节与 work_index.md.j2 维护规则自带退休条款（文本自洽、不引用本仓脚本）；ship 第 4 步、cleanup 第 4 步接入退休契约四步（入度守卫、既有归档目录只归 needs-review、untracked 二选一出口）；recovery_surface_policy 补生命周期合同与 lessons 写法纪律；Spec 接口/状态节补分发机制两行。验证（批2 收尾时全绿）：node scripts/check-plugin.mjs、bash scripts/agent/check.sh、python3 -B skills/harness-builder/tests/test_scripts.py。
Next: 批3（sweep skill + 全枚举面同步含 CONTEXT.md + version bump；合入前必做 TienKung-Lab 只读实测）。
Limits: 019 遗留未了项：master 领先 origin 未推送（推送远端待用户执行）；remove-deadcode-py 协议未在真实 Python 项目实测（vulture/Ruff 命令以官方文档为准）。
