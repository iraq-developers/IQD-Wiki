"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { mkInitial, mkEmpty } from "../data";
import { normalizeCV } from "../cv-schema";
import type { CVData } from "../types";
import type { UILang } from "../i18n";
import { useMounted } from "./use-mounted";

/* ══════════════════════════════════════════════════════
   CV STORE — state, undo/redo history, autosave
══════════════════════════════════════════════════════ */

const STORAGE_KEY = "iqdwiki:cv:v1";
const STORAGE_VERSION = 1;
const HISTORY_LIMIT = 50;
/** Keystrokes closer together than this collapse into one undo step. */
const COALESCE_MS = 600;
const SAVE_DEBOUNCE_MS = 500;

export const MIN_DENSITY = 0.75;
export const MAX_DENSITY = 1.15;

export interface CVPrefs {
    accentColor: string;
    density: number;
    uiLang: UILang;
}

const DEFAULT_PREFS: CVPrefs = {
    accentColor: "#1e40af",
    density: 1,
    uiLang: "en",
};

export type SaveState = "idle" | "saving" | "saved";

/** Same shape as a React setter, plus an option to force an undo checkpoint. */
export type CVUpdater = CVData | ((prev: CVData) => CVData);
export type SetCV = (updater: CVUpdater, opts?: { checkpoint?: boolean }) => void;

interface StoredShape {
    v: number;
    cv: unknown;
    prefs?: Partial<CVPrefs>;
}

function readStorage(): { cv: CVData; prefs: CVPrefs } | null {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as StoredShape;
        if (!parsed || typeof parsed !== "object") return null;

        // Everything from storage goes through the normalizer, so a stale or
        // hand-corrupted entry can never brick the page.
        const { cv } = normalizeCV(parsed.cv);
        const prefs: CVPrefs = {
            accentColor: typeof parsed.prefs?.accentColor === "string" ? parsed.prefs.accentColor : DEFAULT_PREFS.accentColor,
            density: clampDensity(Number(parsed.prefs?.density)),
            uiLang: parsed.prefs?.uiLang === "ar" ? "ar" : "en",
        };
        return { cv, prefs };
    } catch {
        return null;
    }
}

function clampDensity(v: number): number {
    if (!Number.isFinite(v)) return 1;
    return Math.min(MAX_DENSITY, Math.max(MIN_DENSITY, v));
}

export function useCVStore() {
    /* Restored during the very first client render rather than in an effect,
       so the builder paints the user's real CV immediately. Hydration stays
       safe because the page renders a skeleton until `hydrated` is true. */
    const [restored] = useState(() => (typeof window === "undefined" ? null : readStorage()));
    const [cv, setCVState] = useState<CVData>(() => restored?.cv ?? mkInitial());
    const [prefs, setPrefsState] = useState<CVPrefs>(() => restored?.prefs ?? DEFAULT_PREFS);
    const hydrated = useMounted();
    const [saveState, setSaveState] = useState<SaveState>("idle");

    /* The history stacks live in refs (they must be readable synchronously
       inside setCV), while their *availability* is mirrored into state so the
       undo/redo buttons re-render without anyone reading a ref while
       rendering. */
    const past = useRef<CVData[]>([]);
    const future = useRef<CVData[]>([]);
    const lastPush = useRef(0);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    /* A mirror of `cv` we can read synchronously — lets setCV compute the
       previous value without an impure state updater (React StrictMode would
       otherwise double-invoke it and corrupt the history stack). */
    const cvRef = useRef(cv);

    const syncHistoryFlags = useCallback(() => {
        setCanUndo(past.current.length > 0);
        setCanRedo(future.current.length > 0);
    }, []);

    /* ── Core setter ───────────────────────────────────── */
    const setCV = useCallback<SetCV>((updater, opts) => {
        const prev = cvRef.current;
        const next = typeof updater === "function" ? (updater as (p: CVData) => CVData)(prev) : updater;
        if (next === prev) return;

        const now = Date.now();
        const shouldPush = opts?.checkpoint === true || now - lastPush.current > COALESCE_MS;

        if (shouldPush) {
            past.current.push(prev);
            if (past.current.length > HISTORY_LIMIT) past.current.shift();
            future.current = [];
            syncHistoryFlags();
        }
        lastPush.current = now;

        cvRef.current = next;
        setCVState(next);
    }, [syncHistoryFlags]);

    /** Shorthand for editing a single top-level field. */
    const upd = useCallback(<K extends keyof CVData>(k: K, v: CVData[K]) => {
        setCV(p => ({ ...p, [k]: v }));
    }, [setCV]);

    /** Structural edits (add / delete / reorder) always get their own undo step. */
    const updNow = useCallback(<K extends keyof CVData>(k: K, v: CVData[K]) => {
        setCV(p => ({ ...p, [k]: v }), { checkpoint: true });
    }, [setCV]);

    /* ── Replace wholesale (AI import, reset, .json upload) ── */
    const replaceCV = useCallback((next: CVData) => {
        setCV(next, { checkpoint: true });
    }, [setCV]);

    const resetToSample = useCallback(() => replaceCV(mkInitial()), [replaceCV]);
    const resetToBlank = useCallback(() => replaceCV(mkEmpty()), [replaceCV]);

    /* ── Undo / redo ───────────────────────────────────── */
    const undo = useCallback(() => {
        const prev = past.current.pop();
        if (!prev) return;
        future.current.push(cvRef.current);
        cvRef.current = prev;
        setCVState(prev);
        lastPush.current = 0;
        syncHistoryFlags();
    }, [syncHistoryFlags]);

    const redo = useCallback(() => {
        const next = future.current.pop();
        if (!next) return;
        past.current.push(cvRef.current);
        cvRef.current = next;
        setCVState(next);
        lastPush.current = 0;
        syncHistoryFlags();
    }, [syncHistoryFlags]);

    /* ── Prefs ─────────────────────────────────────────── */
    const setPrefs = useCallback((patch: Partial<CVPrefs>) => {
        setPrefsState(p => ({
            ...p,
            ...patch,
            ...(patch.density !== undefined ? { density: clampDensity(patch.density) } : {}),
        }));
    }, []);

    /* ── Autosave (debounced) ──────────────────────────── */
    useEffect(() => {
        if (!hydrated) return;
        const marking = setTimeout(() => setSaveState("saving"), 0);
        const writing = setTimeout(() => {
            try {
                const payload: StoredShape = { v: STORAGE_VERSION, cv, prefs };
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
                setSaveState("saved");
            } catch {
                // Quota exceeded or storage disabled — the app still works,
                // it just won't survive a refresh.
                setSaveState("idle");
            }
        }, SAVE_DEBOUNCE_MS);
        return () => { clearTimeout(marking); clearTimeout(writing); };
    }, [cv, prefs, hydrated]);

    return {
        cv, setCV, upd, updNow, replaceCV,
        prefs, setPrefs,
        hydrated, saveState,
        undo, redo, canUndo, canRedo,
        resetToSample, resetToBlank,
    };
}

export type CVStore = ReturnType<typeof useCVStore>;
