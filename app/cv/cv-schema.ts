import {
    uid,
    DEFAULT_SECTIONS,
    SECTION_IDS,
    type CVData,
    type Bullet,
    type Link,
    type Skill,
    type Job,
    type Project,
    type Simple,
    type SectionMeta,
    type SectionId,
} from "./types";

/* ══════════════════════════════════════════════════════
   CV SCHEMA / NORMALIZER

   The single gate every piece of untrusted data passes
   through: AI-pasted JSON, uploaded .json backups, and
   localStorage rehydration.

   Guarantees:
   • Never throws. Any input produces a renderable CVData.
   • Every id is regenerated, so ids can never collide.
   • Tolerates the shapes LLMs actually emit, not just ours.
══════════════════════════════════════════════════════ */

export interface NormalizeResult {
    cv: CVData;
    /** Human-readable notes about what had to be repaired. */
    warnings: string[];
}

type Dict = Record<string, unknown>;

const isObj = (v: unknown): v is Dict =>
    typeof v === "object" && v !== null && !Array.isArray(v);

/** Coerce anything sane into a trimmed string. Objects/arrays become "". */
function str(v: unknown, fallback = ""): string {
    if (typeof v === "string") return v.trim();
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v == null) return fallback;
    return fallback;
}

/** Read the first present key from a list of aliases. */
function pick(o: Dict, ...keys: string[]): unknown {
    for (const k of keys) {
        if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
    }
    return undefined;
}

/** Anything → array. A bare object or scalar becomes a one-element array. */
function arr(v: unknown): unknown[] {
    if (Array.isArray(v)) return v;
    if (v == null || v === "") return [];
    return [v];
}

/* ── Bullets ───────────────────────────────────────────
   Accepts: ["text"], [{text}], [{point}], [{description}],
   "one\ntwo", or a single string.                        */
function normBullets(v: unknown): Bullet[] {
    if (typeof v === "string") {
        return v
            .split(/\r?\n/)
            .map(s => s.replace(/^\s*[-•*]\s*/, "").trim())
            .filter(Boolean)
            .map(text => ({ id: uid(), text }));
    }
    return arr(v)
        .map((b): Bullet | null => {
            if (typeof b === "string") {
                const text = b.replace(/^\s*[-•*]\s*/, "").trim();
                return text ? { id: uid(), text } : null;
            }
            if (isObj(b)) {
                const text = str(pick(b, "text", "point", "description", "content", "value", "bullet"));
                return text ? { id: uid(), text } : null;
            }
            return null;
        })
        .filter((b): b is Bullet => b !== null);
}

/* ── Links ─────────────────────────────────────────────
   Accepts: [{label, href}], [{label, url}], [{name, url}],
   ["https://…"], or {LinkedIn: "https://…"}.             */
function ensureProtocol(href: string): string {
    if (!href) return "";
    if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
    if (/^www\./i.test(href) || /^[\w-]+\.[a-z]{2,}/i.test(href)) return `https://${href}`;
    return href;
}

function labelFromHref(href: string): string {
    try {
        const u = new URL(ensureProtocol(href));
        return u.hostname.replace(/^www\./, "");
    } catch {
        return "Link";
    }
}

function normLinks(v: unknown): Link[] {
    // Object form: { LinkedIn: "https://…", GitHub: "https://…" }
    if (isObj(v) && !Array.isArray(v)) {
        return Object.entries(v)
            .map(([label, href]) => ({ id: uid(), label: str(label), href: ensureProtocol(str(href)) }))
            .filter(l => l.href);
    }
    return arr(v)
        .map((l): Link | null => {
            if (typeof l === "string") {
                const href = ensureProtocol(l.trim());
                return href ? { id: uid(), label: labelFromHref(href), href } : null;
            }
            if (isObj(l)) {
                const href = ensureProtocol(str(pick(l, "href", "url", "link", "address")));
                const label = str(pick(l, "label", "name", "title", "text", "platform")) || labelFromHref(href);
                return href || label ? { id: uid(), label, href } : null;
            }
            return null;
        })
        .filter((l): l is Link => l !== null);
}

/* ── Skills ────────────────────────────────────────────
   Accepts: [{label, value}], [{category, skills: []}],
   ["React", "Vue"], or {Frontend: "React, Vue"}.         */
function normSkills(v: unknown): Skill[] {
    if (isObj(v) && !Array.isArray(v)) {
        return Object.entries(v).map(([label, value]) => ({
            id: uid(),
            label: str(label),
            value: Array.isArray(value) ? value.map(x => str(x)).filter(Boolean).join(", ") : str(value),
        }));
    }

    const items = arr(v);
    // A flat list of skill names with no categories → fold into one row.
    const allStrings = items.length > 0 && items.every(i => typeof i === "string");
    if (allStrings) {
        const value = items.map(i => str(i)).filter(Boolean).join(", ");
        return value ? [{ id: uid(), label: "Skills", value }] : [];
    }

    return items
        .map((s): Skill | null => {
            if (!isObj(s)) return null;
            const label = str(pick(s, "label", "category", "name", "title", "group"));
            const raw = pick(s, "value", "skills", "items", "list", "values", "text");
            const value = Array.isArray(raw)
                ? raw.map(x => (isObj(x) ? str(pick(x, "name", "label", "text")) : str(x))).filter(Boolean).join(", ")
                : str(raw);
            return label || value ? { id: uid(), label, value } : null;
        })
        .filter((s): s is Skill => s !== null);
}

/* ── Jobs ──────────────────────────────────────────────
   Accepts our {title, bullets} plus the very common
   {role, company, period/dates, bullets} decomposition.  */
function composeJobTitle(o: Dict): string {
    const direct = str(pick(o, "title", "heading", "header"));
    const role = str(pick(o, "role", "position", "jobTitle"));
    const company = str(pick(o, "company", "employer", "organization", "org"));
    const period = str(pick(o, "period", "dates", "date", "duration", "years", "timeframe"));

    // A "title" that already carries company/date info is used verbatim.
    if (direct && !role && !company) {
        return period && !direct.includes(period) ? `${direct} (${period})` : direct;
    }

    const left = [role || direct, company].filter(Boolean).join(" | ");
    if (!left) return period ? `(${period})` : "";
    return period ? `${left} (${period})` : left;
}

function normJobs(v: unknown): Job[] {
    return arr(v)
        .map((j): Job | null => {
            if (typeof j === "string") {
                const title = str(j);
                return title ? { id: uid(), title, bullets: [] } : null;
            }
            if (!isObj(j)) return null;
            const title = composeJobTitle(j);
            const bullets = normBullets(
                pick(j, "bullets", "points", "highlights", "achievements", "responsibilities", "details", "description")
            );
            return title || bullets.length ? { id: uid(), title, bullets } : null;
        })
        .filter((j): j is Job => j !== null);
}

/* ── Projects ─────────────────────────────────────────── */
function normProjects(v: unknown): Project[] {
    return arr(v)
        .map((p): Project | null => {
            if (typeof p === "string") {
                const name = str(p);
                return name ? { id: uid(), name, links: [], description: "", bullets: [] } : null;
            }
            if (!isObj(p)) return null;

            const name = str(pick(p, "name", "title", "project", "projectName"));
            const description = str(pick(p, "description", "summary", "intro", "about", "tagline"));

            // Links may live under `links`, or as a lone `url`/`github`/`demo` key.
            let links = normLinks(pick(p, "links", "urls"));
            if (links.length === 0) {
                const loose: Link[] = [];
                for (const key of ["url", "link", "github", "repo", "demo", "liveDemo", "website"]) {
                    const href = ensureProtocol(str(p[key]));
                    if (href) loose.push({ id: uid(), label: key === "url" || key === "link" ? labelFromHref(href) : key, href });
                }
                links = loose;
            }

            const bullets = normBullets(pick(p, "bullets", "points", "highlights", "features", "achievements", "details"));
            return name || description || bullets.length
                ? { id: uid(), name, links, description, bullets }
                : null;
        })
        .filter((p): p is Project => p !== null);
}

/* ── Simple lists (education, languages) ──────────────── */
function composeEducation(o: Dict): string {
    const direct = str(pick(o, "text", "entry", "line"));
    if (direct) return direct;

    const degree = str(pick(o, "degree", "qualification", "program", "study", "name", "title"));
    const school = str(pick(o, "school", "institution", "university", "college", "org"));
    const location = str(pick(o, "location", "city"));
    const period = str(pick(o, "period", "year", "years", "dates", "date", "graduation"));

    const head = [degree, [school, location].filter(Boolean).join(", ")].filter(Boolean).join(" — ");
    if (!head) return period;
    return period ? `${head} (${period})` : head;
}

function composeLanguage(o: Dict): string {
    const direct = str(pick(o, "text", "entry", "line"));
    if (direct) return direct;

    const name = str(pick(o, "language", "name", "lang"));
    const level = str(pick(o, "level", "proficiency", "fluency"));
    if (!name) return level;
    return level ? `${name} (${level})` : name;
}

function normSimple(v: unknown, compose: (o: Dict) => string): Simple[] {
    if (typeof v === "string") {
        return v
            .split(/\r?\n/)
            .map(s => s.trim())
            .filter(Boolean)
            .map(text => ({ id: uid(), text }));
    }
    return arr(v)
        .map((e): Simple | null => {
            if (typeof e === "string") {
                const text = str(e);
                return text ? { id: uid(), text } : null;
            }
            if (isObj(e)) {
                const text = compose(e);
                return text ? { id: uid(), text } : null;
            }
            return null;
        })
        .filter((e): e is Simple => e !== null);
}

/* ── Sections ─────────────────────────────────────────── */
function normSections(v: unknown): SectionMeta[] {
    const seen = new Set<SectionId>();
    const out: SectionMeta[] = [];

    for (const s of arr(v)) {
        let id: string | undefined;
        let visible = true;
        if (typeof s === "string") {
            id = s;
        } else if (isObj(s)) {
            id = str(pick(s, "id", "name", "key"));
            if (typeof s.visible === "boolean") visible = s.visible;
            if (typeof s.hidden === "boolean") visible = !s.hidden;
        }
        const lowered = id?.toLowerCase() as SectionId | undefined;
        if (lowered && (SECTION_IDS as readonly string[]).includes(lowered) && !seen.has(lowered)) {
            seen.add(lowered);
            out.push({ id: lowered, visible });
        }
    }

    // Any section the input didn't mention keeps its default position at the end.
    for (const { id, visible } of DEFAULT_SECTIONS) {
        if (!seen.has(id)) out.push({ id, visible });
    }
    return out;
}

/* ══════════════════════════════════════════════════════
   MAIN ENTRY
══════════════════════════════════════════════════════ */

export function emptyCV(): CVData {
    return {
        name: "",
        titleLine: "",
        phone: "",
        location: "",
        email: "",
        links: [],
        summary: "",
        skillsTitle: "Skills & Technologies",
        skills: [],
        expTitle: "Work Experience",
        jobs: [],
        projTitle: "Featured Projects",
        projects: [],
        eduTitle: "Education",
        education: [],
        langTitle: "Languages",
        languages: [],
        sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
    };
}

export function normalizeCV(input: unknown): NormalizeResult {
    const warnings: string[] = [];
    const base = emptyCV();

    if (!isObj(input)) {
        return { cv: base, warnings: ["That wasn't a CV object, so a blank CV was used instead."] };
    }

    // Some models wrap the payload: { cv: {...} } or { data: {...} }.
    const root: Dict =
        isObj(input.cv) ? (input.cv as Dict)
            : isObj(input.data) ? (input.data as Dict)
                : isObj(input.resume) ? (input.resume as Dict)
                    : input;

    // Contact details are sometimes nested under `contact`/`personal`.
    const contact: Dict = isObj(root.contact) ? (root.contact as Dict)
        : isObj(root.personal) ? (root.personal as Dict)
            : isObj(root.personalInfo) ? (root.personalInfo as Dict)
                : {};

    const readBoth = (...keys: string[]) => pick(root, ...keys) ?? pick(contact, ...keys);

    const cv: CVData = {
        name: str(readBoth("name", "fullName", "fullname")) || base.name,
        titleLine: str(readBoth("titleLine", "title", "jobTitle", "headline", "role", "profession")),
        phone: str(readBoth("phone", "phoneNumber", "mobile", "tel")),
        location: str(readBoth("location", "address", "city")),
        email: str(readBoth("email", "mail", "emailAddress")),
        links: normLinks(readBoth("links", "socials", "socialLinks", "profiles", "urls")),
        summary: str(readBoth("summary", "about", "profile", "objective", "bio", "professionalSummary")),

        skillsTitle: str(pick(root, "skillsTitle")) || base.skillsTitle,
        skills: normSkills(pick(root, "skills", "skillCategories", "technologies", "techStack")),

        expTitle: str(pick(root, "expTitle", "experienceTitle")) || base.expTitle,
        jobs: normJobs(pick(root, "jobs", "experience", "workExperience", "employment", "work")),

        projTitle: str(pick(root, "projTitle", "projectsTitle")) || base.projTitle,
        projects: normProjects(pick(root, "projects", "featuredProjects", "portfolio")),

        eduTitle: str(pick(root, "eduTitle", "educationTitle")) || base.eduTitle,
        education: normSimple(pick(root, "education", "schooling", "academics"), composeEducation),

        langTitle: str(pick(root, "langTitle", "languagesTitle")) || base.langTitle,
        languages: normSimple(pick(root, "languages", "languageSkills"), composeLanguage),

        sections: normSections(pick(root, "sections", "sectionOrder")),
    };

    /* ── Report anything meaningful that was missing ── */
    if (!cv.name) warnings.push("No name was found — add it in Personal Info.");
    if (!cv.summary) warnings.push("No summary was found.");
    if (cv.jobs.length === 0) warnings.push("No work experience was found.");
    if (cv.skills.length === 0) warnings.push("No skills were found.");
    if (cv.links.length === 0 && !cv.email && !cv.phone) {
        warnings.push("No contact details were found — recruiters need at least one.");
    }

    return { cv, warnings };
}

/* ══════════════════════════════════════════════════════
   MERGE
   Fills blanks in `current` from `incoming` and appends
   list entries, rather than replacing wholesale.
══════════════════════════════════════════════════════ */

export function mergeCV(current: CVData, incoming: CVData): CVData {
    const keepStr = (a: string, b: string) => (a.trim() ? a : b);
    const append = <T,>(a: T[], b: T[]) => (b.length ? [...a, ...b] : a);

    return {
        name: keepStr(current.name, incoming.name),
        titleLine: keepStr(current.titleLine, incoming.titleLine),
        phone: keepStr(current.phone, incoming.phone),
        location: keepStr(current.location, incoming.location),
        email: keepStr(current.email, incoming.email),
        summary: keepStr(current.summary, incoming.summary),

        skillsTitle: keepStr(current.skillsTitle, incoming.skillsTitle),
        expTitle: keepStr(current.expTitle, incoming.expTitle),
        projTitle: keepStr(current.projTitle, incoming.projTitle),
        eduTitle: keepStr(current.eduTitle, incoming.eduTitle),
        langTitle: keepStr(current.langTitle, incoming.langTitle),

        links: append(current.links, incoming.links),
        skills: append(current.skills, incoming.skills),
        jobs: append(current.jobs, incoming.jobs),
        projects: append(current.projects, incoming.projects),
        education: append(current.education, incoming.education),
        languages: append(current.languages, incoming.languages),

        sections: current.sections,
    };
}

/* ══════════════════════════════════════════════════════
   DIFF SUMMARY — plain language, for the review dialog
══════════════════════════════════════════════════════ */

export interface DiffRow {
    label: string;
    before: string;
    after: string;
    changed: boolean;
}

export function diffCV(before: CVData, after: CVData): DiffRow[] {
    const text = (label: string, a: string, b: string): DiffRow => ({
        label,
        before: a || "—",
        after: b || "—",
        changed: a.trim() !== b.trim(),
    });
    const count = (label: string, a: unknown[], b: unknown[]): DiffRow => ({
        label,
        before: `${a.length}`,
        after: `${b.length}`,
        changed: a.length !== b.length,
    });

    const bulletCount = (jobs: Job[], projects: Project[]) =>
        jobs.reduce((n, j) => n + j.bullets.length, 0) + projects.reduce((n, p) => n + p.bullets.length, 0);

    return [
        text("Name", before.name, after.name),
        text("Job title", before.titleLine, after.titleLine),
        text("Email", before.email, after.email),
        text("Phone", before.phone, after.phone),
        text("Location", before.location, after.location),
        {
            label: "Summary",
            before: before.summary ? `${before.summary.length} chars` : "—",
            after: after.summary ? `${after.summary.length} chars` : "—",
            changed: before.summary.trim() !== after.summary.trim(),
        },
        count("Links", before.links, after.links),
        count("Skill groups", before.skills, after.skills),
        count("Jobs", before.jobs, after.jobs),
        count("Projects", before.projects, after.projects),
        {
            label: "Bullet points",
            before: `${bulletCount(before.jobs, before.projects)}`,
            after: `${bulletCount(after.jobs, after.projects)}`,
            changed: bulletCount(before.jobs, before.projects) !== bulletCount(after.jobs, after.projects),
        },
        count("Education", before.education, after.education),
        count("Languages", before.languages, after.languages),
    ];
}
