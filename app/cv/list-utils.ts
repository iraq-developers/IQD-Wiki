import { uid, type Job, type Project, type Bullet, type Link, type Skill, type Simple } from "./types";

/* ══════════════════════════════════════════════════════
   PURE ARRAY HELPERS
   Shared by every list editor so add / remove / move /
   duplicate behave identically everywhere.
══════════════════════════════════════════════════════ */

/** Move an item, clamping the target index. Returns the same array if it's a no-op. */
export function move<T>(list: T[], from: number, to: number): T[] {
    if (from === to || from < 0 || from >= list.length) return list;
    const target = Math.max(0, Math.min(list.length - 1, to));
    if (target === from) return list;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(target, 0, item);
    return next;
}

export function removeAt<T>(list: T[], index: number): T[] {
    if (index < 0 || index >= list.length) return list;
    return list.filter((_, i) => i !== index);
}

export function insertAt<T>(list: T[], index: number, item: T): T[] {
    const next = [...list];
    next.splice(Math.max(0, Math.min(list.length, index)), 0, item);
    return next;
}

export function replaceAt<T>(list: T[], index: number, item: T): T[] {
    if (index < 0 || index >= list.length) return list;
    return list.map((x, i) => (i === index ? item : x));
}

export function updateById<T extends { id: string }>(list: T[], id: string, patch: Partial<T>): T[] {
    return list.map(x => (x.id === id ? { ...x, ...patch } : x));
}

export function removeById<T extends { id: string }>(list: T[], id: string): T[] {
    return list.filter(x => x.id !== id);
}

export function indexById<T extends { id: string }>(list: T[], id: string): number {
    return list.findIndex(x => x.id === id);
}

/* ══════════════════════════════════════════════════════
   CLONES — every nested id is regenerated so a duplicate
   never shares keys with its original.
══════════════════════════════════════════════════════ */

export const cloneBullet = (b: Bullet): Bullet => ({ ...b, id: uid() });
export const cloneLink = (l: Link): Link => ({ ...l, id: uid() });
export const cloneSkill = (s: Skill): Skill => ({ ...s, id: uid() });
export const cloneSimple = (s: Simple): Simple => ({ ...s, id: uid() });

export const cloneJob = (j: Job): Job => ({
    id: uid(),
    title: j.title,
    bullets: j.bullets.map(cloneBullet),
});

export const cloneProject = (p: Project): Project => ({
    id: uid(),
    name: p.name,
    description: p.description,
    links: p.links.map(cloneLink),
    bullets: p.bullets.map(cloneBullet),
});
