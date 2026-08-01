const KEY = "iqdwiki.typing.v1";

export interface TypingStore {
    /** Keyboard sounds. Off unless the user turns them on. */
    sound: boolean;
    /** Ids of samples typed all the way through. */
    done: string[];
    /** Where to pick up a half-finished sample. */
    resume: { id: string; at: number } | null;
}

const EMPTY: TypingStore = { sound: false, done: [], resume: null };

export function readStore(): TypingStore {
    if (typeof window === "undefined") return EMPTY;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return EMPTY;
        const parsed = JSON.parse(raw) as Partial<TypingStore>;
        return {
            sound: parsed.sound ?? false,
            done: Array.isArray(parsed.done) ? parsed.done : [],
            resume: parsed.resume ?? null,
        };
    } catch {
        return EMPTY;
    }
}

export function writeStore(patch: Partial<TypingStore>) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify({ ...readStore(), ...patch }));
    } catch {
        // storage full or blocked — practising still works, it just won't be remembered
    }
}
