"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cleanText } from "./clean-text";
import { playKey, playMiss } from "./sounds";
import { readStore, writeStore } from "./storage";
import { SAMPLES, nextSampleAfter, randomSample, type Sample } from "./samples";

export interface Piece {
    id: string;
    title: string;
    text: string;
}

export function useTyping() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("sample-from");

    const [ready, setReady] = useState(false);
    const [piece, setPiece] = useState<Piece | null>(null);
    const [typed, setTyped] = useState("");
    const [done, setDone] = useState(false);
    const [sound, setSound] = useState(false);
    const [completed, setCompleted] = useState<string[]>([]);
    const [resume, setResume] = useState<{ id: string; at: number } | null>(null);
    const [slugState, setSlugState] = useState<"idle" | "loading" | "error">("idle");

    // The keydown handler reads through refs so it can be registered once and
    // never rebuilt — the old engine recreated it on every single keystroke.
    const pieceRef = useRef<Piece | null>(null);
    const typedRef = useRef("");
    const doneRef = useRef(false);
    const soundRef = useRef(false);
    pieceRef.current = piece;
    typedRef.current = typed;
    doneRef.current = done;
    soundRef.current = sound;

    /* ── boot ─────────────────────────────────────────────────────────── */

    useEffect(() => {
        const store = readStore();
        setSound(store.sound);
        setCompleted(store.done);
        setResume(store.resume);
        setReady(true);
    }, []);

    /* ── ?sample-from=<article-slug> ───────────────────────────────────── */

    useEffect(() => {
        if (!slug || !ready) return;
        let cancelled = false;
        setSlugState("loading");
        (async () => {
            try {
                const res = await fetch(`/api/raw/${encodeURIComponent(slug)}`);
                if (!res.ok) throw new Error("not found");
                const text = cleanText(await res.text());
                if (cancelled) return;
                if (!text) throw new Error("empty");
                setPiece({ id: `article:${slug}`, title: slug.replace(/-/g, " "), text });
                setTyped("");
                setDone(false);
                setSlugState("idle");
            } catch {
                if (!cancelled) setSlugState("error");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, ready]);

    /* ── starting / leaving a piece ────────────────────────────────────── */

    const start = useCallback((sample: Sample, at = 0) => {
        setPiece({ id: sample.id, title: sample.title, text: sample.text });
        setTyped(sample.text.slice(0, at));
        setDone(false);
    }, []);

    const leave = useCallback(() => {
        setPiece(null);
        setTyped("");
        setDone(false);
    }, []);

    const again = useCallback(() => {
        setTyped("");
        setDone(false);
    }, []);

    const next = useCallback(() => {
        const current = pieceRef.current;
        const upcoming = current
            ? (nextSampleAfter(current.id) ?? randomSample())
            : randomSample();
        start(upcoming);
    }, [start]);

    const toggleSound = useCallback(() => {
        setSound((prev) => {
            writeStore({ sound: !prev });
            return !prev;
        });
    }, []);

    /* ── remember where you got to ─────────────────────────────────────── */

    useEffect(() => {
        if (!ready || !piece || done) return;
        if (!SAMPLES.some((s) => s.id === piece.id)) return; // articles aren't resumable
        const at = typed.length;
        const id = piece.id;
        const t = setTimeout(() => {
            const spot = at > 40 ? { id, at } : null;
            writeStore({ resume: spot });
            setResume(spot);
        }, 800);
        return () => clearTimeout(t);
    }, [typed, piece, done, ready]);

    const finish = useCallback(() => {
        setDone(true);
        const current = pieceRef.current;
        if (!current) return;
        const store = readStore();
        const isSample = SAMPLES.some((s) => s.id === current.id);
        const list = isSample && !store.done.includes(current.id)
            ? [...store.done, current.id]
            : store.done;
        writeStore({ done: list, resume: null });
        setCompleted(list);
        setResume(null);
    }, []);

    /* ── typing ───────────────────────────────────────────────────────── */

    const push = useCallback(
        (chars: string) => {
            const text = pieceRef.current?.text;
            if (!text) return;
            const value = typedRef.current + chars;
            typedRef.current = value;
            setTyped(value);
            if (value.length >= text.length) finish();
        },
        [finish],
    );

    useEffect(() => {
        if (!piece) return;

        const onKey = (e: KeyboardEvent) => {
            const text = pieceRef.current?.text;
            if (!text) return;

            if (e.key === "Escape") {
                e.preventDefault();
                leave();
                return;
            }
            if (e.key === "Tab") {
                e.preventDefault();
                typedRef.current = "";
                again();
                return;
            }
            if (doneRef.current) return;

            // Ctrl/Cmd+Enter skips the rest of the current line
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const from = typedRef.current.length;
                const brk = text.indexOf("\n", from);
                push(text.slice(from, brk === -1 ? text.length : brk + 1));
                return;
            }
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            if (e.key === "Backspace") {
                e.preventDefault();
                const value = typedRef.current.slice(0, -1);
                typedRef.current = value;
                setTyped(value);
                return;
            }

            let char: string | null = null;
            if (e.key === "Enter") char = "\n";
            else if (e.key.length === 1) char = e.key;
            if (char === null) return;

            e.preventDefault();
            if (soundRef.current) {
                if (char === text[typedRef.current.length]) playKey();
                else playMiss();
            }
            push(char);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [piece, push, leave, again]);

    return {
        ready,
        piece,
        typed,
        done,
        sound,
        completed,
        resume,
        slug,
        slugState,
        start,
        leave,
        again,
        next,
        toggleSound,
    };
}
