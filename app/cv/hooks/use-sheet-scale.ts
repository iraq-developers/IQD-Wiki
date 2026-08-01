"use client";

import { useCallback, useEffect, useState } from "react";
import { SHEET_W, SHEET_H } from "./use-cv-export";

/* ══════════════════════════════════════════════════════
   SHEET SCALE

   The A4 sheet is always laid out at exactly 794×1123 CSS
   px so exports stay pixel-identical. To make it fit any
   viewport we scale a *wrapper* around it — the sheet node
   itself is never transformed, which keeps the PDF's link
   coordinate maths correct.

   The wrapper's height is set to the scaled height so the
   scroll container still reports the right length.
══════════════════════════════════════════════════════ */

export type Zoom = number | "fit";

export const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5] as const;

const MIN_SCALE = 0.15;
const MAX_SCALE = 2;

/**
 * @param containerRef the scroll container to measure against
 * @param naturalHeight actual unscaled sheet height — larger than 1123 when
 *   content is spilling past the page, so the wrapper reserves the right room.
 */
export function useSheetScale(
    containerRef: React.RefObject<HTMLDivElement | null>,
    zoom: Zoom,
    naturalHeight: number = SHEET_H
) {
    const [fitScale, setFitScale] = useState(1);

    const measure = useCallback((availableWidth: number) => {
        if (availableWidth <= 0) return;
        const next = Math.min(1, availableWidth / SHEET_W);
        setFitScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, next)));
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // contentRect excludes padding, so the gutter is handled by CSS alone.
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) measure(entry.contentRect.width);
        });
        ro.observe(el);
        measure(el.clientWidth - getHorizontalPadding(el));
        return () => ro.disconnect();
    }, [measure, containerRef]);

    const scale = zoom === "fit" ? fitScale : Math.max(MIN_SCALE, Math.min(MAX_SCALE, zoom));

    return {
        scale,
        fitScale,
        /** Height the wrapper must reserve so scrolling matches what's visible. */
        scaledHeight: Math.max(naturalHeight, SHEET_H) * scale,
        scaledWidth: SHEET_W * scale,
    };
}

function getHorizontalPadding(el: HTMLElement): number {
    const cs = getComputedStyle(el);
    return parseFloat(cs.paddingLeft || "0") + parseFloat(cs.paddingRight || "0");
}
