"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCVStore } from "./use-cv";
import { useCVExport, SHEET_H } from "./use-cv-export";
import { usePageFit, CONTENT_BUDGET } from "./use-page-fit";
import { useSheetScale, type Zoom } from "./use-sheet-scale";
import { SHEET_PAD_TOP, SHEET_PAD_BOTTOM } from "../preview/sheet-styles";
import { makeT } from "../i18n";

/* ══════════════════════════════════════════════════════
   BUILDER — one hook wiring together state, export,
   page-fit and scaling, so both shells consume the same
   object and stay perfectly in sync.
══════════════════════════════════════════════════════ */

export function useCVBuilder() {
    const store = useCVStore();
    const t = useMemo(() => makeT(store.prefs.uiLang), [store.prefs.uiLang]);

    const { setPrefs } = store;
    const setDensity = useCallback((d: number) => setPrefs({ density: d }), [setPrefs]);
    const setAccentColor = useCallback((c: string) => setPrefs({ accentColor: c }), [setPrefs]);

    const exporter = useCVExport(store.cv, t);
    const contentRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const fit = usePageFit({
        sheetRef: exporter.cvRef,
        contentRef,
        density: store.prefs.density,
        setDensity,
    });

    const [zoom, setZoom] = useState<Zoom>("fit");

    /* When content spills, the sheet grows so the user can see the cut line. */
    const naturalHeight = fit.fits
        ? SHEET_H
        : Math.max(SHEET_H, fit.contentHeight + SHEET_PAD_TOP + SHEET_PAD_BOTTOM + 24);

    const scaler = useSheetScale(previewContainerRef, zoom, naturalHeight);

    /* ── Keyboard shortcuts ── */
    const { undo, redo } = store;
    const { exportPDF, printCV } = exporter;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;
            if (!mod) return;
            const key = e.key.toLowerCase();

            if (key === "z") {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            } else if (key === "y") {
                e.preventDefault();
                redo();
            } else if (key === "s") {
                e.preventDefault();
                void exportPDF();
            } else if (key === "p") {
                e.preventDefault();
                void printCV();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [undo, redo, exportPDF, printCV]);

    return {
        ...store,
        t,
        setDensity,
        setAccentColor,
        ...exporter,
        contentRef,
        previewContainerRef,
        fit,
        zoom,
        setZoom,
        ...scaler,
        contentBudget: CONTENT_BUDGET,
    };
}

export type CVBuilder = ReturnType<typeof useCVBuilder>;
