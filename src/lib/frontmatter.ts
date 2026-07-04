// Frontmatter 模板解析与合并工具

/** 内置变量的默认值与标签 */
const BUILTIN_VARS: Record<string, { label: string; default: string | (() => string); placeholder: string }> = {
  title: { label: "标题", default: "", placeholder: "文章标题" },
  date: { label: "日期", default: () => new Date().toISOString().slice(0, 10), placeholder: "YYYY-MM-DD" },
  description: { label: "简介", default: "", placeholder: "文章简介描述" },
  image: { label: "预览图", default: "", placeholder: "图片 URL 或路径" },
  author: { label: "作者", default: "", placeholder: "作者名" },
  tags: { label: "标签", default: "", placeholder: "标签1, 标签2" },
};

function getVarDefault(key: string): string {
  const v = BUILTIN_VARS[key];
  if (!v) return "";
  return typeof v.default === "function" ? v.default() : v.default;
}

function getVarLabel(key: string): string {
  return BUILTIN_VARS[key]?.label ?? key;
}

function getVarPlaceholder(key: string): string {
  return BUILTIN_VARS[key]?.placeholder ?? `输入 ${key}`;
}

/** 从模板中提取所有 {variable} 变量名（去重，保持顺序） */
export function extractTemplateVars(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  const seen = new Set<string>();
  return matches.map((m) => m.slice(1, -1)).filter((v) => {
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}

/** 获取变量的显示信息 */
export function getVarInfo(key: string): { label: string; placeholder: string } {
  return { label: getVarLabel(key), placeholder: getVarPlaceholder(key) };
}

/** 为模板中的变量生成初始值（title 自动填充） */
export function buildInitialVars(template: string, title: string): Record<string, string> {
  const vars = extractTemplateVars(template);
  const result: Record<string, string> = {};
  for (const v of vars) {
    if (v === "title") {
      result[v] = title;
    } else {
      result[v] = getVarDefault(v);
    }
  }
  return result;
}

/**
 * 渲染 frontmatter 模板，替换所有 {variable} 变量
 */
export function renderFrontmatter(
  template: string,
  vars: Record<string, string>,
): string {
  const allVars: Record<string, string> = { ...vars };
  // date 默认取今天
  if (extractTemplateVars(template).includes("date") && !allVars.date) {
    allVars.date = new Date().toISOString().slice(0, 10);
  }
  // description 默认从 title 提取
  if (extractTemplateVars(template).includes("description") && !allVars.description) {
    allVars.description = allVars.title || "";
  }

  let result = template;
  for (const [key, value] of Object.entries(allVars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), escapeYaml(value));
  }
  return result;
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
