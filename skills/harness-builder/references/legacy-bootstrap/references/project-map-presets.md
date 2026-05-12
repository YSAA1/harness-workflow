# 项目地图预设

用于 `bootstrap`。项目地图是冷启动索引，不是完整目录树。

默认落点是 `docs/project-map.md`。如果项目已有 `ARCHITECTURE.md`、`CONTEXT.md`、`docs/architecture.md` 等稳定地图，可以复用既有文件，并在 `AGENTS.md` 只写指针。

## 通用字段

- 入口：用户或运行时从哪里进入。
- 核心代码：主要业务逻辑在哪里。
- 测试：unit / integration / E2E 在哪里。
- 配置：包管理、构建、环境变量、部署配置在哪里。
- 文档：README、架构文档、API 文档在哪里。
- 状态：`task_plan.md`、`progress.md`、`findings.md` 或项目既有恢复文件在哪里。
- 验证：常用命令和 smoke / E2E 候选。

## 空项目

```md
## 项目地图

- `AGENTS.md`：agent 冷启动入口。
- `task_plan.md`：当前执行计划。
- `progress.md`：追加式进度和验证记录。
- `findings.md`：设计决策、风险、拒绝方案和引用。
- `[源码目录待定]`：尚未创建；由第一个实现 slice 决定。
- `[验证命令待定]`：尚未创建；bootstrap 后由 plan/implement 补齐。
```

## Web / Frontend

```md
## 项目地图

- `src/` 或 `app/`：应用入口、路由和页面。
- `components/`：可复用 UI 组件。
- `styles/`：全局样式和设计 token。
- `tests/` / `*.test.*`：单元或组件测试。
- `e2e/`：端到端测试；缺失时记录为 bootstrap gap。
- `package.json`：脚本、依赖和构建入口。
```

## API / Backend

```md
## 项目地图

- `src/main.*` / `cmd/*/main.*`：服务入口。
- `routes/` / `handlers/`：HTTP/API 入口。
- `services/` / `domain/`：核心业务逻辑。
- `db/` / `migrations/`：数据层和迁移。
- `tests/`：单元和集成测试。
- `.env.example` / config files：环境变量和运行配置。
```

## Python / Research

```md
## 项目地图

- `src/` 或包名目录：可复用代码。
- `scripts/`：训练、评估、数据处理入口。
- `configs/`：实验配置。
- `notebooks/`：探索性分析；不要作为唯一事实来源。
- `data/`：数据约定；大文件通常不进 git。
- `outputs/` / `runs/`：实验输出；记录清理和保留规则。
- `tests/`：单元或 smoke 测试。
```

## CLI / Tooling

```md
## 项目地图

- `bin/` 或 package entry：命令入口。
- `src/commands/`：命令定义。
- `src/lib/`：核心库逻辑。
- `fixtures/`：测试夹具。
- `tests/`：命令和库测试。
- `package.json` / `pyproject.toml` / `Cargo.toml`：打包和脚本入口。
```

## Docs / Course

```md
## 项目地图

- `docs/`：内容源。
- `assets/` / `public/`：静态资源。
- `site/` / config：站点生成配置。
- `examples/` / `projects/`：示例或练习代码。
- `package.json` / build config：预览和构建命令。
- `tests/` / link checker：内容校验入口。
```
