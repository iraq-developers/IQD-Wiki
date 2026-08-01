/* ══════════════════════════════════════════════════════
   CV TYPES & UID HELPER
══════════════════════════════════════════════════════ */

export interface Link {
    id: string;
    label: string;
    href: string;
}

export interface Bullet {
    id: string;
    text: string;
}

export interface Skill {
    id: string;
    label: string;
    value: string;
}

export interface Job {
    id: string;
    title: string;
    bullets: Bullet[];
}

export interface Project {
    id: string;
    name: string;
    links: Link[];
    description: string;
    bullets: Bullet[];
}

export interface Simple {
    id: string;
    text: string;
}

/* ── Body sections the user can reorder / hide ── */
export const SECTION_IDS = ["skills", "experience", "projects", "education", "languages"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionMeta {
    id: SectionId;
    visible: boolean;
}

export const DEFAULT_SECTIONS: SectionMeta[] = SECTION_IDS.map(id => ({ id, visible: true }));

export interface CVData {
    name: string;
    titleLine: string;
    phone: string;
    location: string;
    email: string;
    links: Link[];
    summary: string;
    skillsTitle: string;
    skills: Skill[];
    expTitle: string;
    jobs: Job[];
    projTitle: string;
    projects: Project[];
    eduTitle: string;
    education: Simple[];
    langTitle: string;
    languages: Simple[];
    /** Order + visibility of the body sections. */
    sections: SectionMeta[];
}

/* ══════════════════════════════════════════════════════
   UID
   Must be globally unique: AI-generated JSON ships ids like
   "1", "2", "3", which used to collide with the old counter
   and made editing one bullet mutate another.
══════════════════════════════════════════════════════ */
let _n = 0;
export const uid = (): string => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `k${Date.now().toString(36)}-${(++_n).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export const makeBullet = (text: string): Bullet => ({ id: uid(), text });
export const makeLink = (label: string, href: string): Link => ({ id: uid(), label, href });
export const makeSimple = (text: string): Simple => ({ id: uid(), text });
export const makeSkill = (label: string, value: string): Skill => ({ id: uid(), label, value });
