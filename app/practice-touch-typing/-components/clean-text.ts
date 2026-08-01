/**
 * Strip markdown syntax and remove any character not directly on a keyboard.
 * Preserves newlines so the full content structure is shown.
 */
export function cleanText(md: string): string {
    let t = md
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
        .replace(/^[-*_]{3,}\s*$/gm, "")
        .replace(/<[^>]+>/g, "")
        .replace(/^>\s+/gm, "")
        .replace(/^[\s]*[-*+]\s+/gm, "")
        .replace(/^[\s]*\d+\.\s+/gm, "")
        .replace(/^\|[-:|\s]+\|\s*$/gm, "")
        .replace(/\|/g, " ")
        .replace(/^::youtube\[.*?\]\s*$/gm, "");

    // Only keep printable ASCII (32-126) and newlines
    t = t.replace(/[^\x20-\x7E\n]/g, "");

    // Collapse spaces/tabs on each line (but preserve newlines)
    t = t
        .split("\n")
        .map((line) => line.replace(/[ \t]+/g, " ").trim())
        .join("\n");

    // Collapse 3+ consecutive blank lines into 2
    t = t.replace(/\n{3,}/g, "\n\n");

    return t.trim();
}
