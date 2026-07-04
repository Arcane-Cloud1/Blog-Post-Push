// Frontmatter 模板解析与合并工具

/**
 * 渲染 frontmatter 模板，替换 {title}、{date}、{description} 等变量
 */
export function renderFrontmatter(
  template: string,
  vars: {
    title: string;
    date?: string;
    description?: string;
    [key: string]: string | undefined;
  },
): string {
  const dateStr = vars.date ?? new Date().toISOString().slice(0, 10);
  const desc = vars.description ?? extractFirstParagraph(vars.title, "");

  return template
    .replace(/\{title\}/g, escapeYaml(vars.title))
    .replace(/\{date\}/g, dateStr)
    .replace(/\{description\}/g, escapeYaml(desc));
}

/**
 * 将 frontmatter 与正文内容合并
 */
export function mergeFrontmatter(
  content: string,
  frontmatter: string,
): string {
  const stripped = stripExistingFrontmatter(content);
  return `${frontmatter}\n\n${stripped}`;
}

/**
 * 移除已有的 frontmatter（防止重复添加）
 */
export function stripExistingFrontmatter(content: string): string {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) return content;
  const idx = trimmed.indexOf("\n---", 3);
  if (idx === -1) return content;
  const end = trimmed.indexOf("\n", idx + 4);
  return end === -1 ? "" : trimmed.slice(end + 1);
}

/**
 * 从正文提取第一段作为描述
 */
function extractFirstParagraph(title: string, content: string): string {
  if (content.trim()) {
    const lines = content.split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (t && !t.startsWith("#") && !t.startsWith("---")) {
        return t.replace(/[*_`~>!\[\]]/g, "").slice(0, 120);
      }
    }
  }
  return title;
}

/**
 * 转义 YAML 字符串值（单引号转义）
 */
function escapeYaml(str: string): string {
  return str.replace(/'/g, "''");
}
