#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json"))
  ? cwd
  : path.resolve(cwd, "plugins/harness-workflow");
const skillsRoot = path.join(root, "skills");
const outRoot = path.join(root, "docs", "skill-flow-review");

const skillOrder = [
  ["harness-builder", "项目级 harness"],
  ["brainstorm", "构思 Spec"],
  ["plan", "Executable Plan"],
  ["implement", "小步执行"],
  ["diagnose", "失败诊断"],
  ["review", "证据评审"],
  ["verify", "最终验证"],
  ["cleanup", "Knowledge Cleanup"],
];

const routeMap = [
  ["harness-builder", "brainstorm"],
  ["harness-builder", "plan"],
  ["brainstorm", "plan"],
  ["brainstorm", "harness-builder"],
  ["plan", "harness-builder"],
  ["plan", "implement"],
  ["plan", "verify"],
  ["implement", "review"],
  ["implement", "diagnose"],
  ["implement", "plan"],
  ["diagnose", "implement"],
  ["diagnose", "review"],
  ["diagnose", "harness-builder"],
  ["review", "verify"],
  ["review", "diagnose"],
  ["review", "implement"],
  ["verify", "cleanup"],
  ["verify", "diagnose"],
  ["verify", "harness-builder"],
  ["cleanup", "implement"],
  ["cleanup", "harness-builder"],
];

const primaryFlow = [
  "brainstorm",
  "plan",
  "implement",
  "review",
  "verify",
  "cleanup",
];

const branchFlows = [
  ["工作面缺口", ["harness-builder", "plan", "implement"]],
  ["需求不清", ["brainstorm", "plan"]],
  ["执行失败", ["implement", "diagnose", "implement"]],
  ["评审发现问题", ["review", "implement", "review"]],
  ["最终验证失败", ["verify", "diagnose", "review"]],
  ["能力缺口", ["verify", "harness-builder", "verify"]],
  ["知识漂移", ["review", "verify", "cleanup"]],
];

const pageTitle = "Harness Workflow Skill 流程审阅";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripMarkdown(value) {
  return value
    .replace(/\\"/g, '"')
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .trim();
}

function truncate(value, max = 220) {
  const compact = stripMarkdown(value).replace(/\s+/g, " ");
  return compact.length > max ? `${compact.slice(0, max - 1)}...` : compact;
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontMatter = {};
  if (!match) return frontMatter;
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    frontMatter[pair[1]] = pair[2].replace(/^"|"$/g, "");
  }
  return frontMatter;
}

function getSection(markdown, heading) {
  const pattern = new RegExp(`^## ${escapeRegExp(heading)}\\s*$`, "m");
  const match = markdown.match(pattern);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = rest.search(/^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function getSubsection(markdown, heading) {
  const pattern = new RegExp(`^### ${escapeRegExp(heading)}\\s*$`, "m");
  const match = markdown.match(pattern);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = rest.search(/^### |^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listLines(markdown, limit = 12) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^- \[[ xX]\]/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) =>
      stripMarkdown(line.replace(/^[-*]\s+/, "").replace(/^- \[[ xX]\]\s+/, "").replace(/^\d+\.\s+/, "")),
    )
    .filter(Boolean)
    .slice(0, limit);
}

function tableLines(markdown, limit = 10) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|") && !/^\|\s*-+/.test(line))
    .slice(0, limit);
}

function parseSteps(section) {
  const lines = section.split(/\r?\n/);
  const steps = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^### (第\s+[^—-]+[—-]\s*.+)$/);
    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    if (heading) {
      if (current) steps.push(current);
      current = { title: stripMarkdown(heading[1]), body: [] };
      continue;
    }
    if (numbered) {
      if (current) steps.push(current);
      current = { title: stripMarkdown(numbered[2]), body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) steps.push(current);
  return steps.map((step) => ({
    title: step.title,
    summary: truncate(
      step.body
        .filter((line) => line.trim() && !line.trim().startsWith("```"))
        .slice(0, 8)
        .join(" "),
      260,
    ),
  }));
}

function introParagraph(markdown) {
  const withoutFrontmatter = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const afterTitle = withoutFrontmatter.replace(/^\s*#\s+.+\r?\n+/, "");
  const beforeSection = afterTitle.split(/\n## /)[0] ?? "";
  const paragraphs = beforeSection
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return paragraphs.join("\n\n");
}

function boldBullet(section, label) {
  const line = section
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item.startsWith("- **") && item.includes(`**${label}**:`));
  if (!line) return [];
  return [stripMarkdown(line.replace(/^-\s+/, "").replace(new RegExp(`^${escapeRegExp(label)}:\\s*`), ""))];
}

function parseReferences(markdown, skillDir) {
  const refs = [...markdown.matchAll(/`(references\/[^`]+\.md)`/g)]
    .map((match) => match[1])
    .filter((value, index, array) => array.indexOf(value) === index);
  return refs.map((ref) => {
    const absolute = path.join(skillsRoot, skillDir, ref);
    let title = ref;
    if (fs.existsSync(absolute)) {
      const firstHeading = fs.readFileSync(absolute, "utf8").match(/^#\s+(.+)$/m);
      if (firstHeading) title = firstHeading[1];
    }
    return { ref, title, exists: fs.existsSync(absolute) };
  });
}

function readSkill(slug) {
  const filePath = path.join(skillsRoot, slug, "SKILL.md");
  const markdown = fs.readFileSync(filePath, "utf8");
  const frontMatter = parseFrontMatter(markdown);
  const routingSnapshot = getSection(markdown, "Routing Snapshot");
  const flow = getSection(markdown, "执行流程") || getSection(markdown, "Workflow") || getSection(markdown, "Workflow Skeleton");
  const route = getSubsection(markdown, "路由规则") || getSection(markdown, "Decision Gate") || getSection(markdown, "Recommended next skill");
  const steps = parseSteps(flow);
  const assetRouting = getSection(markdown, "Asset Routing");
  const artifactsSection =
    getSection(markdown, "工件更新") || getSection(markdown, "Preservation rule for existing harness-builder assets");
  return {
    slug,
    name: frontMatter.name || slug,
    description: frontMatter.description || "",
    path: `skills/${slug}/SKILL.md`,
    lineCount: markdown.split(/\r?\n/).length,
    purpose: truncate(getSection(markdown, "目的") || introParagraph(markdown), 360),
    triggers: listLines(getSubsection(markdown, "触发信号")).length
      ? listLines(getSubsection(markdown, "触发信号"))
      : listLines(getSection(markdown, "When to use")).length
        ? listLines(getSection(markdown, "When to use"))
      : boldBullet(routingSnapshot, "Use when"),
    dontUse: listLines(getSubsection(markdown, "不要使用")).length
      ? listLines(getSubsection(markdown, "不要使用"))
      : listLines(getSection(markdown, "Do not use")).length
        ? listLines(getSection(markdown, "Do not use"))
        : listLines(getSection(markdown, "Hard rules")).length
          ? listLines(getSection(markdown, "Hard rules"), 6)
      : boldBullet(routingSnapshot, "Do not use when"),
    inputs: listLines(getSection(markdown, "先读取这些输入")).length
      ? listLines(getSection(markdown, "先读取这些输入"))
      : steps.length
        ? [steps[0].summary]
        : [],
    routeTables: tableLines(route),
    steps,
    output: truncate(getSection(markdown, "输出契约") || getSection(markdown, "输出格式") || getSection(markdown, "Output contract") || getSection(markdown, "Output Contract"), 420),
    acceptance: listLines(getSection(markdown, "验收标准") || getSection(markdown, "Mandatory execution gates"), 16),
    artifacts: listLines(artifactsSection, 12).length
      ? listLines(artifactsSection, 12)
      : assetRouting
        ? [truncate(assetRouting, 180)]
        : [],
    references: parseReferences(markdown, slug),
  };
}

function renderList(items, empty = "未抽取到条目") {
  if (!items.length) return `<p class="muted">${escapeHtml(empty)}</p>`;
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderTables(lines) {
  if (!lines.length) return `<p class="muted">该 skill 没有显式路由表；以执行流程的下一步为准。</p>`;
  const rows = lines.map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => escapeHtml(stripMarkdown(cell.trim()))),
  );
  const [head, ...body] = rows;
  return `<table><thead><tr>${head.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${body
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function renderReferences(skill) {
  if (!skill.references.length) return `<p class="muted">无额外 reference；审阅 SKILL.md 即可。</p>`;
  return `<ul>${skill.references
    .map((item) => {
      const href = `../../skills/${skill.slug}/${item.ref}`;
      const state = item.exists ? "存在" : "缺失";
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(item.title)}</a><span class="tag">${state}</span></li>`;
    })
    .join("")}</ul>`;
}

function shell() {
  return `<style>
:root {
  --bg: #f7f5ef;
  --ink: #1f2933;
  --muted: #667085;
  --line: #d7d1c3;
  --panel: #ffffff;
  --accent: #0f766e;
  --accent-2: #b45309;
  --accent-3: #334155;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font: 15px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--ink);
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
header {
  background: #102a2a;
  color: #fff;
  padding: 28px 36px 30px;
}
header p { max-width: 920px; color: #dbe7e5; margin: 8px 0 0; }
main { max-width: 1180px; margin: 0 auto; padding: 28px 24px 48px; }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
.button {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 6px 10px;
  border: 1px solid rgba(255,255,255,.35);
  color: #fff;
  border-radius: 6px;
}
.section { margin: 26px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 14px; }
.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 0 rgba(31,41,51,.04);
}
.panel h2, .panel h3 { margin-top: 0; }
.muted { color: var(--muted); }
.tag {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 1px 7px;
  margin-left: 7px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--accent-3);
  font-size: 12px;
  white-space: nowrap;
}
.skill-card h3 { margin-bottom: 4px; }
.meta { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
.flow { display: grid; gap: 10px; }
.step {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  align-items: start;
}
.num {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
}
.step h3 { margin: 2px 0 3px; font-size: 16px; }
.step p { margin: 0; color: var(--muted); }
.route {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.route-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 8px 0 14px;
}
.route-label {
  min-width: 112px;
  color: var(--muted);
  font-weight: 700;
}
.route span {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 9px;
}
.arrow { color: var(--accent-2); font-weight: 700; }
table { width: 100%; border-collapse: collapse; background: #fff; }
th, td { border: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }
th { background: #edf4f2; }
ul { padding-left: 20px; }
code { background: #eef2f0; padding: 1px 4px; border-radius: 4px; }
pre {
  white-space: pre-wrap;
  word-break: break-word;
  background: #f8faf9;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 10px;
}
.source-note { font-size: 13px; color: var(--muted); }
@media (max-width: 720px) {
  header { padding: 22px 20px; }
  main { padding: 20px 16px 36px; }
  .step { grid-template-columns: 1fr; }
  .num { width: 26px; height: 26px; }
}
</style>`;
}

function renderSkillPage(skill, category) {
  const sourceHref = `../../${skill.path}`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(skill.name)} - ${pageTitle}</title>
${shell()}
</head>
<body>
<header>
  <p><a class="button" href="index.html">返回总览</a></p>
  <h1>${escapeHtml(skill.name)}</h1>
  <p>${escapeHtml(skill.description)}</p>
  <div class="toolbar">
    <a class="button" href="${escapeHtml(sourceHref)}">打开 SKILL.md</a>
    <span class="button">${escapeHtml(category)}</span>
    <span class="button">${skill.lineCount} 行</span>
  </div>
</header>
<main>
  <section class="section panel">
    <h2>核心思想</h2>
    <p>${escapeHtml(skill.purpose)}</p>
  </section>

  <section class="section grid">
    <div class="panel">
      <h2>进入条件</h2>
      ${renderList(skill.triggers)}
    </div>
    <div class="panel">
      <h2>禁用条件</h2>
      ${renderList(skill.dontUse)}
    </div>
    <div class="panel">
      <h2>先读输入</h2>
      ${renderList(skill.inputs)}
    </div>
  </section>

  <section class="section panel">
    <h2>执行流程</h2>
    <div class="flow">
      ${skill.steps
        .map(
          (step, index) => `<div class="step">
        <div class="num">${index + 1}</div>
        <div><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.summary)}</p></div>
      </div>`,
        )
        .join("")}
    </div>
  </section>

  <section class="section grid">
    <div class="panel">
      <h2>输出形态</h2>
      <pre>${escapeHtml(skill.output || "未抽取到输出格式")}</pre>
    </div>
    <div class="panel">
      <h2>工件更新</h2>
      ${renderList(skill.artifacts)}
    </div>
  </section>

  <section class="section panel">
    <h2>路由规则</h2>
    ${renderTables(skill.routeTables)}
  </section>

  <section class="section grid">
    <div class="panel">
      <h2>验收闸门</h2>
      ${renderList(skill.acceptance)}
    </div>
    <div class="panel">
      <h2>Progressive Disclosure</h2>
      ${renderReferences(skill)}
    </div>
  </section>

  <p class="source-note">本页由 <code>scripts/generate-skill-flow-html.mjs</code> 从 <code>${escapeHtml(skill.path)}</code> 自动生成。</p>
</main>
</body>
</html>
`;
}

function renderIndex(skills) {
  const cardBySlug = new Map(skills.map((item) => [item.slug, item]));
  const renderFlow = (items) =>
    items
      .map((slug, index) => {
        const skill = cardBySlug.get(slug);
        if (!skill) return "";
        const arrow = index === items.length - 1 ? "" : `<span class="arrow">→</span>`;
        return `<span><a href="${slug}.html">${skill.name}</a></span>${arrow}`;
      })
      .join("");
  const branchHtml = branchFlows
    .map(([label, items]) => `<div class="route-row"><div class="route-label">${escapeHtml(label)}</div><div class="route">${renderFlow(items)}</div></div>`)
    .join("");
  const routeListHtml = routeMap
    .map(([from, to]) => {
      const fromSkill = cardBySlug.get(from);
      const toSkill = cardBySlug.get(to);
      if (!fromSkill || !toSkill) return "";
      return `<tr><td><a href="${from}.html">${fromSkill.name}</a></td><td><a href="${to}.html">${toSkill.name}</a></td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pageTitle}</title>
${shell()}
</head>
<body>
<header>
  <h1>${pageTitle}</h1>
  <p>这些页面把 ${skills.length} 个 Harness Workflow active skill 抽成可审阅的条件路由图谱：什么时候进、怎么走、产出什么、验收什么、下一步去哪里。</p>
  <div class="toolbar">
    <a class="button" href="../harness-method-contract.md">Method Contract</a>
    <a class="button" href="../../README.md">插件 README</a>
  </div>
</header>
<main>
  <section class="section panel">
    <h2>条件主线</h2>
    <div class="route">${renderFlow(primaryFlow)}</div>
  </section>

  <section class="section panel">
    <h2>分支与回路</h2>
    ${branchHtml}
    <details>
      <summary>展开完整转场表</summary>
      <table><thead><tr><th>From</th><th>To</th></tr></thead><tbody>${routeListHtml}</tbody></table>
    </details>
  </section>

  <section class="section">
    <h2>Skill 审阅入口</h2>
    <div class="grid">
      ${skills
        .map(
          (skill) => `<article class="panel skill-card">
        <h3><a href="${skill.slug}.html">${escapeHtml(skill.name)}</a></h3>
        <p class="muted">${escapeHtml(skill.category)} · ${skill.lineCount} 行 · ${skill.steps.length} 个流程步</p>
        <p>${escapeHtml(skill.purpose)}</p>
        <div class="meta">
          <span class="tag">${skill.references.length} 个 reference</span>
          <span class="tag">${skill.acceptance.length} 条验收项</span>
        </div>
      </article>`,
        )
        .join("")}
    </div>
  </section>

  <section class="section panel">
    <h2>审阅建议</h2>
    <ul>
      <li>先看条件主线，确认 skill 之间的转场是否符合日常项目节奏。</li>
      <li>逐张打开 skill 页面，检查进入条件、禁用条件和验收闸门是否足够具体。</li>
      <li>发现语义不准时优先改对应 <code>SKILL.md</code>，再重新运行生成脚本。</li>
    </ul>
  </section>

  <p class="source-note">生成命令：<code>node scripts/generate-skill-flow-html.mjs</code></p>
</main>
</body>
</html>
`;
}

fs.mkdirSync(outRoot, { recursive: true });
for (const file of fs.readdirSync(outRoot)) {
  if (file.endsWith(".html")) fs.unlinkSync(path.join(outRoot, file));
}

const skills = skillOrder.map(([slug, category]) => ({ ...readSkill(slug), category }));

function writeHtml(file, html) {
  const normalized = html.replace(/[ \t]+$/gm, "").trimEnd() + "\n";
  fs.writeFileSync(path.join(outRoot, file), normalized);
}

for (const skill of skills) {
  writeHtml(`${skill.slug}.html`, renderSkillPage(skill, skill.category));
}
writeHtml("index.html", renderIndex(skills));

console.log(`Generated ${skills.length + 1} HTML files in ${path.relative(process.cwd(), outRoot)}`);
