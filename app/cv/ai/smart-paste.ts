/* ══════════════════════════════════════════════════════
   SMART PASTE

   Users paste whatever the AI gave them: a clean fenced
   block, JSON buried in three paragraphs of chatter, or
   JSON with trailing commas and smart quotes. This finds
   the CV object in all of it — and never throws.
══════════════════════════════════════════════════════ */

export type PasteErrorCode = "empty" | "no-json" | "bad-json" | "not-cv";

export type PasteResult =
    | { ok: true; value: Record<string, unknown> }
    | { ok: false; code: PasteErrorCode };

/** Keys that mark an object as plausibly a CV rather than some other JSON. */
const CV_KEYS = [
    "name", "titleLine", "title", "summary", "jobs", "experience", "workExperience",
    "skills", "projects", "education", "languages", "email", "phone",
];

function looksLikeCV(value: unknown): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const obj = value as Record<string, unknown>;

    // Models sometimes wrap the payload — unwrap before judging.
    const inner = (["cv", "data", "resume"] as const)
        .map(k => obj[k])
        .find(v => typeof v === "object" && v !== null && !Array.isArray(v));
    const target = (inner ?? obj) as Record<string, unknown>;

    const hits = CV_KEYS.filter(k => target[k] !== undefined).length;
    return hits >= 2;
}

/** Repair the malformations LLMs actually produce. */
function repair(text: string): string {
    return text
        // Smart quotes around keys and values
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        // // line comments and /* block */ comments
        .replace(/^\s*\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Trailing commas before a closing brace or bracket
        .replace(/,(\s*[}\]])/g, "$1")
        // Literal newlines inside a quoted string would be illegal JSON;
        // models emit them in long summaries.
        .replace(/"(?:[^"\\]|\\.)*"/g, m => m.replace(/\n/g, "\\n").replace(/\r/g, ""));
}

function tryParse(text: string): Record<string, unknown> | "invalid" {
    const attempts = [text, repair(text)];
    for (const attempt of attempts) {
        try {
            const parsed = JSON.parse(attempt);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                return parsed as Record<string, unknown>;
            }
        } catch {
            /* try the next strategy */
        }
    }
    return "invalid";
}

/**
 * Every balanced `{…}` span in the text, longest first — so a nested object
 * never wins over the full CV that contains it. String-aware, so braces
 * inside values don't confuse the scan.
 */
function balancedObjects(text: string): string[] {
    const spans: string[] = [];
    const starts: number[] = [];
    let inString = false;
    let escaped = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (escaped) { escaped = false; continue; }
        if (ch === "\\") { escaped = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (inString) continue;

        if (ch === "{") starts.push(i);
        else if (ch === "}" && starts.length) {
            const start = starts.pop()!;
            spans.push(text.slice(start, i + 1));
        }
    }

    return spans.sort((a, b) => b.length - a.length);
}

/** All fenced code blocks, preferring ```json ones. */
function fencedBlocks(text: string): string[] {
    const blocks: string[] = [];
    const re = /```[ \t]*([a-zA-Z]*)[ \t]*\r?\n([\s\S]*?)```/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        blocks.push(m[2]);
        if (m[1].toLowerCase() === "json") blocks.unshift(m[2]);
    }
    // An unterminated final fence — the reply got cut off mid-block.
    const dangling = /```[ \t]*[a-zA-Z]*[ \t]*\r?\n([\s\S]*)$/.exec(text);
    if (dangling && !text.trimEnd().endsWith("```")) blocks.push(dangling[1]);
    return blocks;
}

export function extractCVJson(raw: string): PasteResult {
    const text = raw?.trim() ?? "";
    if (!text) return { ok: false, code: "empty" };

    let sawJsonShape = false;
    let sawNonCVObject = false;

    /* 1 — fenced blocks, then 2 — the raw text, then 3 — every balanced
       object inside it, longest first. */
    const seeds = [...fencedBlocks(text), text];
    const seen = new Set<string>();
    const candidates: string[] = [];
    const push = (s: string) => {
        const key = s.trim();
        if (key.startsWith("{") && !seen.has(key)) {
            seen.add(key);
            candidates.push(key);
        }
    };

    seeds.forEach(push);
    for (const seed of seeds) balancedObjects(seed).forEach(push);

    for (const candidate of candidates.slice(0, 200)) {
        const trimmed = candidate.trim();
        if (!trimmed.startsWith("{")) continue;
        sawJsonShape = true;

        const parsed = tryParse(trimmed);
        if (parsed === "invalid") continue;

        if (looksLikeCV(parsed)) return { ok: true, value: parsed };
        sawNonCVObject = true;
    }

    if (sawNonCVObject) return { ok: false, code: "not-cv" };
    if (sawJsonShape) return { ok: false, code: "bad-json" };
    return { ok: false, code: "no-json" };
}

export const PASTE_ERROR_KEY: Record<PasteErrorCode, "pasteEmpty" | "pasteNoJson" | "pasteBadJson" | "pasteNotCv"> = {
    empty: "pasteEmpty",
    "no-json": "pasteNoJson",
    "bad-json": "pasteBadJson",
    "not-cv": "pasteNotCv",
};
