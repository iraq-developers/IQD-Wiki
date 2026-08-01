"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SHEET_H } from "./use-cv-export";
import { SHEET_PAD_TOP, SHEET_PAD_BOTTOM } from "../preview/sheet-styles";
import { MIN_DENSITY, MAX_DENSITY } from "./use-cv";

/* ══════════════════════════════════════════════════════
   PAGE FIT

   Measures the live document against the A4 text box and
   reports how much (if anything) spills past page one.

   `autoFit` binary-searches the density variable for the
   largest value that still fits — it writes the variable
   straight to the DOM while probing (so React does no work
   per iteration) and only commits the winner to state.
══════════════════════════════════════════════════════ */

/** Usable vertical space inside the sheet's padding. */
export const CONTENT_BUDGET = SHEET_H - SHEET_PAD_TOP - SHEET_PAD_BOTTOM;

/** px → cm on an A4 page (1123px == 297mm). */
export const pxToCm = (px: number) => (px * 29.7) / SHEET_H;

export function formatSpill(px: number): string {
    const cm = pxToCm(px);
    if (cm < 1) return `${Math.round(cm * 10)} mm`;
    return `${cm.toFixed(1)} cm`;
}

const SEARCH_ITERATIONS = 7;

/** Wait for the browser to lay out and paint the change we just made. */
const nextFrame = () =>
    new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

interface Options {
    sheetRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    density: number;
    setDensity: (d: number) => void;
}

export function usePageFit({ sheetRef, contentRef, density, setDensity }: Options) {
    const [contentHeight, setContentHeight] = useState(0);
    const [isFitting, setIsFitting] = useState(false);
    const probing = useRef(false);

    /* ── Live measurement ── */
    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const read = () => {
            // Ignore measurements taken mid-probe; autoFit reads directly.
            if (probing.current) return;
            setContentHeight(el.getBoundingClientRect().height);
        };

        const ro = new ResizeObserver(read);
        ro.observe(el);
        read();
        return () => ro.disconnect();
    }, [contentRef]);

    const overflowPx = Math.max(0, contentHeight - CONTENT_BUDGET);
    const fits = overflowPx <= 0.5;

    /* ── Auto-fit ── */
    const autoFit = useCallback(async (): Promise<"fitted" | "already" | "impossible"> => {
        const sheet = sheetRef.current;
        const content = contentRef.current;
        if (!sheet || !content) return "impossible";

        const measureAt = async (d: number) => {
            sheet.style.setProperty("--cv-d", String(d));
            await nextFrame();
            return content.getBoundingClientRect().height;
        };

        setIsFitting(true);
        probing.current = true;
        const original = density;
        let winner = original;
        let outcome: "fitted" | "already" | "impossible" = "fitted";

        try {
            // The roomiest setting we'd ever pick is the user's current one —
            // never silently enlarge text they deliberately shrank.
            const upper = Math.min(MAX_DENSITY, Math.max(original, 1));

            if ((await measureAt(upper)) <= CONTENT_BUDGET) {
                winner = upper;
                outcome = Math.abs(upper - original) < 0.005 ? "already" : "fitted";
            } else if ((await measureAt(MIN_DENSITY)) > CONTENT_BUDGET) {
                winner = MIN_DENSITY;
                outcome = "impossible";
            } else {
                let lo = MIN_DENSITY; // known to fit
                let hi = upper;       // known not to fit
                for (let i = 0; i < SEARCH_ITERATIONS; i++) {
                    const mid = (lo + hi) / 2;
                    if ((await measureAt(mid)) <= CONTENT_BUDGET) lo = mid;
                    else hi = mid;
                }
                // Round down so floating-point noise can't push us back over.
                winner = Math.floor(lo * 100) / 100;
                outcome = "fitted";
            }
            return outcome;
        } finally {
            /* Leave the DOM showing the winner and re-sync our measurement.
               React writes the identical value on the next render, so the
               imperative write and the style prop never disagree. */
            await measureAt(winner);
            setContentHeight(content.getBoundingClientRect().height);
            probing.current = false;
            setIsFitting(false);
            setDensity(winner);
        }
    }, [sheetRef, contentRef, density, setDensity]);

    return { contentHeight, overflowPx, fits, autoFit, isFitting };
}
