"use client";
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * The typing surface.
 *
 * Two things keep this fast no matter how long the text is:
 *
 *  1. Words are their own memoised components, so a keystroke re-renders the
 *     one word you are typing — not the whole article.
 *  2. Only a window of words around the cursor is mounted at all, and the
 *     block is moved with a transform instead of being scrolled, so nothing
 *     ever fights the browser's smooth-scrolling.
 */

const BACK = 80; // words kept behind the cursor
const AHEAD = 300; // words kept in front of it
const STEP = 40; // re-window in chunks so it doesn't churn
const ANCHOR_LINE = 2; // which visible line the cursor sits on

interface Token {
    text: string;
    start: number;
}

function tokenize(text: string): Token[] {
    const out: Token[] = [];
    let i = 0;
    while (i < text.length) {
        if (text[i] === "\n") {
            out.push({ text: "\n", start: i });
            i++;
            continue;
        }
        let j = i;
        while (j < text.length && text[j] !== "\n" && text[j] !== " ") j++;
        while (j < text.length && text[j] === " ") j++;
        out.push({ text: text.slice(i, j), start: i });
        i = j;
    }
    return out;
}

function tokenAt(tokens: Token[], pos: number): number {
    let lo = 0;
    let hi = tokens.length - 1;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (tokens[mid].start <= pos) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}

/* ══ one word ═══════════════════════════════════════════════════════════ */

interface WordProps {
    word: string;
    /** What the user typed over this word, or null if they haven't reached it. */
    typed: string | null;
    /** Cursor offset inside this word, or -1 when the cursor is elsewhere. */
    cursor: number;
    atEnd: boolean;
}

const Word = memo(function Word({ word, typed, cursor, atEnd }: WordProps) {
    const isBreak = word === "\n";
    const untouched = typed === null && cursor < 0;

    if (isBreak) {
        const wrong = typed !== null && typed[0] !== "\n";
        return (
            <>
                <span
                    className={
                        cursor === 0
                            ? "inline-block opacity-40"
                            : wrong
                              ? "inline-block rounded-sm bg-destructive/25 opacity-70"
                              : "inline-block opacity-20"
                    }
                    {...(cursor === 0 ? { "data-c": "" } : {})}
                >
                    ↵
                </span>
                <span className="block h-0 w-full" />
            </>
        );
    }

    if (untouched) {
        return <span className="inline-block whitespace-pre text-muted-foreground/25">{word}</span>;
    }

    return (
        <span className="inline-block whitespace-pre">
            {Array.from(word, (ch, i) => {
                const t = typed?.[i];
                let cls: string;
                if (t === undefined) cls = "text-muted-foreground/25";
                else if (t === ch) cls = "text-foreground";
                else if (ch === " ") cls = "rounded-sm bg-destructive/25";
                else cls = "rounded-sm bg-destructive/10 text-destructive";

                const isCursor = i === cursor;
                return (
                    <span
                        key={i}
                        className={cls}
                        {...(isCursor ? { "data-c": "" } : {})}
                        {...(isCursor && atEnd ? { "data-end": "" } : {})}
                    >
                        {ch}
                    </span>
                );
            })}
        </span>
    );
});

/* ══ the surface ════════════════════════════════════════════════════════ */

export default function TextView({
    text,
    typed,
    hideCursor,
}: {
    text: string;
    typed: string;
    hideCursor: boolean;
}) {
    const tokens = useMemo(() => tokenize(text), [text]);
    const innerRef = useRef<HTMLDivElement>(null);
    const caretRef = useRef<HTMLSpanElement>(null);
    const lastLine = useRef(-1);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cursor = Math.min(typed.length, text.length - 1);
    const active = tokenAt(tokens, cursor);
    const atEnd = typed.length >= text.length;

    const [winStart, setWinStart] = useState(0);
    const target = Math.max(0, Math.floor((active - BACK) / STEP) * STEP);
    if (target !== winStart) setWinStart(target);
    const winEnd = Math.min(tokens.length, winStart + BACK + AHEAD);

    useEffect(() => {
        lastLine.current = -1;
    }, [text]);

    useLayoutEffect(() => {
        const inner = innerRef.current;
        const caret = caretRef.current;
        if (!inner || !caret) return;
        const el = inner.querySelector<HTMLElement>("[data-c]");
        if (!el) return;

        const x = el.offsetLeft + (el.hasAttribute("data-end") ? el.offsetWidth : 0);
        const y = el.offsetTop;
        const h = el.offsetHeight;

        // Don't animate the caret across a line break — it would fly backwards.
        const jumped = y !== lastLine.current;
        if (jumped) caret.style.transition = "none";
        caret.style.height = `${Math.round(h * 0.8)}px`;
        caret.style.transform = `translate3d(${x}px, ${y + h * 0.1}px, 0)`;
        if (jumped) {
            void caret.offsetHeight;
            caret.style.transition = "";
        }
        lastLine.current = y;

        // Hold the cursor's line at a fixed height instead of scrolling to it.
        inner.style.transform = `translate3d(0, ${-Math.max(0, y - ANCHOR_LINE * h)}px, 0)`;

        // The caret only breathes once you stop typing.
        caret.style.animation = "none";
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
            if (caretRef.current) caretRef.current.style.animation = "";
        }, 900);
    }, [typed, winStart, text]);

    useEffect(() => () => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{
                height: "calc(var(--type-line) * 7)",
                maskImage:
                    "linear-gradient(to bottom, transparent, #000 12%, #000 78%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, #000 12%, #000 78%, transparent)",
            }}
        >
            <div ref={innerRef} className="relative will-change-transform">
                <span
                    ref={caretRef}
                    aria-hidden
                    className="typing-caret pointer-events-none absolute start-0 top-0 w-[3px] rounded-full bg-primary"
                    style={{ visibility: hideCursor ? "hidden" : "visible" }}
                />
                {tokens.slice(winStart, winEnd).map((tok, k) => {
                    const i = winStart + k;
                    const touched = tok.start < typed.length;
                    const isActive = i === active;
                    return (
                        <Word
                            key={i}
                            word={tok.text}
                            typed={
                                touched || isActive
                                    ? typed.slice(tok.start, tok.start + tok.text.length)
                                    : null
                            }
                            cursor={isActive ? cursor - tok.start : -1}
                            atEnd={isActive && atEnd}
                        />
                    );
                })}
            </div>
        </div>
    );
}
