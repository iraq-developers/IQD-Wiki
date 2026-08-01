"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import type { CVData } from "../types";
import type { TFunc } from "../i18n";

/* ══════════════════════════════════════════════════════
   EXPORT — PDF (raster + clickable links), PNG, and Print

   The sheet is always laid out at exactly 794×1123 CSS px
   (A4 at 96dpi), so the mm conversion below is a constant.
══════════════════════════════════════════════════════ */

export const SHEET_W = 794;
export const SHEET_H = 1123;
const A4_W_MM = 210;
const A4_H_MM = 297;

/** "Omar Al-Rawi" → "omar-al-rawi-cv" */
function fileSlug(name: string): string {
    const slug = name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
    return slug ? `${slug}-cv` : "cv";
}

/** Nodes marked data-export-hide are preview-only chrome (page-break line, etc.). */
function exportFilter(node: HTMLElement): boolean {
    return !(node.dataset && node.dataset.exportHide === "true");
}

async function waitForFonts() {
    try {
        if (typeof document !== "undefined" && "fonts" in document) {
            await document.fonts.ready;
        }
    } catch {
        /* Font Loading API unavailable — proceed anyway. */
    }
}

function triggerDownload(href: string, filename: string) {
    const a = document.createElement("a");
    a.download = filename;
    a.href = href;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function useCVExport(cv: CVData, t: TFunc) {
    const cvRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    /** Shared pre-flight: blur inputs, settle fonts, let React flush. */
    const prepare = useCallback(async () => {
        (document.activeElement as HTMLElement | null)?.blur?.();
        await waitForFonts();
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));
    }, []);

    const exportPDF = useCallback(async () => {
        if (!cvRef.current || isExporting) return;
        setIsExporting(true);
        try {
            await prepare();
            const [{ toPng }, { jsPDF }] = await Promise.all([
                import("html-to-image"),
                import("jspdf"),
            ]);

            const container = cvRef.current;

            /* Snapshot link rectangles BEFORE rasterising, while the DOM
               is still laid out. The sheet itself is never transformed —
               only its wrapper is — so these coordinates stay in sheet space. */
            const containerRect = container.getBoundingClientRect();
            const scaleX = A4_W_MM / SHEET_W;
            const scaleY = A4_H_MM / SHEET_H;

            const linkAnnotations: { x: number; y: number; w: number; h: number; url: string }[] = [];
            container.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(anchor => {
                const href = anchor.getAttribute("href") || "";
                if (!href || href === "#" || href.startsWith("javascript")) return;
                const rect = anchor.getBoundingClientRect();
                const relY = rect.top - containerRect.top;
                // Anything past the page boundary isn't in the exported image.
                if (relY > SHEET_H) return;
                linkAnnotations.push({
                    x: (rect.left - containerRect.left) * scaleX,
                    y: relY * scaleY,
                    w: Math.max(rect.width * scaleX, 4),
                    h: Math.max(rect.height * scaleY, 4),
                    url: href,
                });
            });

            const dataUrl = await toPng(container, {
                quality: 1,
                pixelRatio: 2,
                width: SHEET_W,
                height: SHEET_H,
                style: { transform: "none", transformOrigin: "top left" },
                filter: exportFilter,
                cacheBust: true,
            });

            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
            pdf.addImage(dataUrl, "PNG", 0, 0, A4_W_MM, A4_H_MM);
            linkAnnotations.forEach(({ x, y, w, h, url }) => pdf.link(x, y, w, h, { url }));
            pdf.save(`${fileSlug(cv.name)}.pdf`);

            toast.success(t("exportReady"), { description: `${fileSlug(cv.name)}.pdf` });
        } catch (e) {
            console.error("PDF export error:", e);
            toast.error(t("exportFailed"), { description: (e as Error)?.message ?? String(e) });
        } finally {
            setIsExporting(false);
        }
    }, [cv.name, isExporting, prepare, t]);

    const exportPNG = useCallback(async () => {
        if (!cvRef.current || isExporting) return;
        setIsExporting(true);
        try {
            await prepare();
            const { toPng } = await import("html-to-image");

            /* Mobile Safari caps canvas memory; 3× on a phone reliably fails. */
            const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
            const pixelRatio = isSmall ? 2 : 3;

            const dataUrl = await toPng(cvRef.current, {
                quality: 1,
                pixelRatio,
                width: SHEET_W,
                height: SHEET_H,
                style: { transform: "none", transformOrigin: "top left" },
                filter: exportFilter,
                cacheBust: true,
            });

            triggerDownload(dataUrl, `${fileSlug(cv.name)}.png`);
            toast.success(t("exportReady"), { description: `${fileSlug(cv.name)}.png` });
        } catch (e) {
            console.error("PNG export error:", e);
            toast.error(t("exportFailed"), { description: (e as Error)?.message ?? String(e) });
        } finally {
            setIsExporting(false);
        }
    }, [cv.name, isExporting, prepare, t]);

    /* Browser print → vector, selectable, ATS-parseable text.
       The print stylesheet lives with the sheet CSS. */
    const printCV = useCallback(async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            await prepare();
            window.print();
        } finally {
            setIsExporting(false);
        }
    }, [isExporting, prepare]);

    return { cvRef, isExporting, exportPDF, exportPNG, printCV };
}
