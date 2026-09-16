---
name: remove-deadcode-py
description: "按需清除 Python 项目的死代码（全仓范围，非任务收尾）：Ruff 快通道 + vulture 分级检测 + 引用/动态访问定罪 + 分批原子删除。Triggers: remove dead code, dead code python, unused code python, 死代码清理, Python 清理死代码, 删除未用代码."
---

# Remove Dead Code (Python)

删除 Python 项目中的未用代码。检测靠工具，定罪靠证据，删除分小批，不追求一次清零。

本 skill 是全仓清理的按需入口，不做任务收尾（收尾走 `cleanup`）。方法思路受 code-yeongyu/oh-my-openagent 的 remove-deadcode 启发（未复制文本），工具行为以 vulture/Ruff/deptry 官方文档为准。非 Python 生态的全仓扫描不在本 skill 范围：JS/TS 用 knip，Go 用 `go tool deadcode`，Rust 用 cargo-machete。

## 流程

1. **定入口（先圈出不可删区）**：`pyproject.toml`/`setup.cfg` 的 `[project.scripts]` 与 `entry_points`、`__main__.py`、`app.py`/`run.py`/`manage.py`、`conftest.py`、Django 的 models/admin/urls/migrations、Celery tasks、插件注册点。入口与框架自动发现面 = 不可删。
2. **快通道**：`ruff check --select F401,F841` 查未用导入/变量；`--fix` 只接受安全修复——`__init__.py` 里的 F401 是 re-export 语义（Ruff 标记为不安全），确认 `__all__` 前不手动删。装了 deptry 可加跑 `deptry .` 查未用依赖。
3. **主扫描**：`vulture <src> --min-confidence 60`。60%（属性/类/函数）只是线索；90%（导入）可进定罪；100%（不可达代码）基本可信，仍走第 4 步。
4. **定罪（三重证据，缺一降级到 needs-review）**：
   - grep 全仓零引用——范围含源码、字符串、注释、配置、文档、CI/workflow、Makefile/Dockerfile；
   - `git log --follow <file>` 溯源：为已放弃的功能而加、或长期无人触碰，加强判断；近期活跃的降级处理；
   - 可选佐证：测试覆盖率（`coverage report`）中从未执行 ≠ 死代码，只作加分项。
5. **守卫清单（命中即保留，无论工具怎么说）**：
   - `getattr` / `globals()` / `eval` / `exec` / `__import__` / `importlib` 可达范围内的动态引用；
   - 注册型装饰器：`@app.route`、`@router.*`、`@cli.command`、`@click.*`、`@pytest.fixture`、`@celery.task` 及自定注册装饰器（grep 装饰器定义处确认注册机制）；
   - dunder 方法、抽象方法/Protocol 实现、运算符重载、dataclass/Pydantic 字段；
   - `__init__.py` 的 re-export 与 `__all__`；
   - 被测试文件引用 = 合法消费者；
   - 打包配置引用：`pyproject.toml` 的 include/packages、setup.cfg、MANIFEST.in。
6. **分批原子删除**：每批一个模块或一组相关符号；删后跑项目最窄测试 + typecheck（若配置）；绿了才 commit（信息写明证据依据）；失败 `git checkout -- <files>` 回滚本批再缩小批次。
7. **级联重扫**：每删完一批重跑 vulture——删除会暴露新的死代码。全部批次结束出报告。

## vulture 白名单纪律

误报压制用 `vulture --make-whitelist <file>... > whitelist_python.py` 生成白名单；白名单条目必须带注释说明"它为什么活着"；白名单本身进入下一轮第 4 步复查——比死代码更危险的是过期的"活着声明"。

## 汇报格式

- **已删**：符号 + 证据摘要（零引用/溯源/覆盖率）。
- **needs-review**：原因（仅工具报告 / 疑似动态访问 / 近期活跃）。
- **保留**：守卫命中项。
- **下一轮候选**：级联暴露的新嫌疑。

## Recommended next skill

- 清理完成：`cleanup` 收尾本轨道，新踩的坑按 lessons 落笔。
- 死代码其实是 bug（该被调用而没人调用、删前测试就红）：`diagnose`。

## 不做

- 不删入口、测试、conftest、migrations、生成代码、vendor 目录。
- 不追求一次清零；大仓分多次会话，每轮以全绿测试收尾。
- 行为异常的"死代码"不当清理做，转 `diagnose`。
