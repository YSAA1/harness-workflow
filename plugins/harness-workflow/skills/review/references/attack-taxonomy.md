# Attack Taxonomy

用于 `review` 的 Adversarial Pass。按分类法构造攻击假设，替代即兴发挥。

## 五类攻击面

### 1. 边界攻击 (Boundary)

输入或状态的边界条件被突破。

- 空值：`null`、`undefined`、空字符串、空集合、缺失字段
- 极值：零、负数、最大值+1、溢出、下溢
- 边界跨越：off-by-one、数组越界、字符串截断
- 类型混淆：数字当字符串、对象当数组、JSON 类型不匹配

**优先检查**：任何接收外部输入的函数、循环边界、集合操作。

### 2. 时序攻击 (Timing)

执行顺序或并发行为产生非预期结果。

- 竞态条件：共享状态被并发修改
- 异步顺序：Promise/callback 触发顺序与假设不同
- 超时/重试：timeout 后状态不一致、重试导致重复操作
- 事件时序：事件 A 在事件 B 之前到达但代码假设相反

**优先检查**：async/await、Promise.all、setTimeout、事件监听器、数据库事务。

### 3. 身份攻击 (Identity)

认证、授权或会话边界被绕过或混淆。

- 权限绕过：缺少 auth check 的路径、直接对象引用
- 会话混淆：token 复用、session fixation、跨用户数据泄露
- 角色提升：低权限用户执行高权限操作
- 输入注入：SQL/命令/模板注入通过用户输入

**优先检查**：API handler、middleware、auth guard、数据库查询、用户输入拼接。

### 4. 契约攻击 (Contract)

API、类型或接口约定被违反。

- 返回值突变：函数在某些路径返回不同类型
- Schema 漂移：API 响应格式与文档不一致
- 参数契约违反：调用方传入不符合约定的参数
- 版本不兼容：依赖升级后接口行为变化

**优先检查**：public API、exported function、跨模块调用、依赖更新。

### 5. 数据攻击 (Data)

状态一致性或持久化被破坏。

- 部分更新：只更新了部分关联状态
- 级联失败：删除/修改关联数据时遗漏
- 状态腐化：无效状态被持久化
- 数据竞争：并发写入导致数据不一致

**优先检查**：数据库操作、缓存更新、状态管理、文件 I/O。

## 按改动类型选择

| 改动类型 | 核心分类 | 次要分类 |
| --- | --- | --- |
| 新增 API endpoint | 身份、契约 | 边界 |
| 修改数据库 schema | 数据 | 时序 |
| 修改 UI 交互 | 时序、边界 | 身份 |
| 依赖升级 | 契约 | — |
| 配置变更 | 边界 | 身份 |
| 算法/逻辑修改 | 边界、数据 | 时序 |
| 重构（行为不变） | 契约 | — |
| 性能优化 | 时序 | 数据 |

## 使用方式

review 执行 Adversarial Pass 时，先按改动类型定位核心分类，逐一构造攻击假设。不要求每类都覆盖；核心分类至少产生一条假设。

```text
Adversarial Review:
  Attack taxonomy applied:
    - 边界: H1 — 空输入导致 crash（file:line）
    - 时序: H2 — 并发请求导致状态不一致（file:line）
    - 身份: skipped (no auth surface touched)
    - 契约: H3 — 返回值类型在错误路径突变（file:line）
    - 数据: skipped (no state mutation)
```

未覆盖的分类写 `skipped (reason)`，不作静默省略。
