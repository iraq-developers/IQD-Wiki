"use client";

import React, { useCallback, useRef } from "react";
import { toast } from "sonner";
import { Minus, Plus, Maximize2, AlertTriangle, CheckCircle2, WandSparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CVPreview } from "./cv-preview";
import { formatSpill } from "../hooks/use-page-fit";
import { SHEET_W } from "../hooks/use-cv-export";
import { MIN_DENSITY, MAX_DENSITY } from "../hooks/use-cv";
import type { CVBuilder } from "../hooks/use-cv-builder";

/* ══════════════════════════════════════════════════════
   PREVIEW STAGE — scroll area, scaled sheet, page-fit UI
══════════════════════════════════════════════════════ */

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.1;

export function PreviewStage({ builder, compact = false }: { builder: CVBuilder; compact?: boolean }) {
    const {
        cv, prefs, cvRef, contentRef, fit, zoom, setZoom, t, setDensity,
        previewContainerRef, scale, fitScale, scaledWidth, scaledHeight,
    } = builder;

    const stepZoom = (delta: number) => {
        const current = zoom === "fit" ? fitScale : zoom;
        setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((current + delta) * 100) / 100)));
    };

    /* ── Pinch to zoom (touch) ── */
    const pinch = useRef<{ dist: number; scale: number } | null>(null);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length !== 2) return;
        const [a, b] = [e.touches[0], e.touches[1]];
        pinch.current = {
            dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
            scale: zoom === "fit" ? fitScale : zoom,
        };
    }, [zoom, fitScale]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (!pinch.current || e.touches.length !== 2) return;
        const [a, b] = [e.touches[0], e.touches[1]];
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinch.current.dist <= 0) return;
        const next = (pinch.current.scale * dist) / pinch.current.dist;
        setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(next * 100) / 100)));
    }, [setZoom]);

    const onTouchEnd = useCallback(() => { pinch.current = null; }, []);

    const runAutoFit = async () => {
        const result = await fit.autoFit();
        if (result === "impossible") toast.warning(t("autoFitImpossible"));
        else if (result === "fitted") toast.success(t("autoFitDone"));
    };

    const percent = Math.round((zoom === "fit" ? fitScale : zoom) * 100);

    return (
        <div className="flex h-full min-h-0 flex-col bg-muted/60 dark:bg-background">

            {/* ── Status + controls bar ── */}
            <div
                className={cn(
                    "flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-b bg-background/80 px-2 py-1.5 backdrop-blur",
                    compact && "px-2"
                )}
                data-export-hide="true"
            >
                {/* Page-fit status */}
                {fit.fits ? (
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span className="truncate">{t("overflowFits")}</span>
                    </span>
                ) : (
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-destructive">
                        <AlertTriangle className="size-3.5 shrink-0" />
                        <span className="truncate">
                            {compact ? formatSpill(fit.overflowPx) : t("overflowBody", { n: formatSpill(fit.overflowPx) })}
                        </span>
                    </span>
                )}

                {!fit.fits && (
                    <Button size="xs" variant="secondary" onClick={runAutoFit} disabled={fit.isFitting}>
                        {fit.isFitting ? <Loader2 className="size-3 animate-spin" /> : <WandSparkles className="size-3" />}
                        {t("autoFit")}
                    </Button>
                )}

                <div className="ms-auto flex items-center gap-1">
                    {/* Density */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="xs" variant="ghost" className="text-xs" aria-label={t("density")}>
                                {t("density")} {Math.round(prefs.density * 100)}%
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">{t("density")}</span>
                                <span className="text-xs text-muted-foreground">{Math.round(prefs.density * 100)}%</span>
                            </div>
                            <Slider
                                value={[prefs.density]}
                                min={MIN_DENSITY}
                                max={MAX_DENSITY}
                                step={0.01}
                                onValueChange={([v]) => setDensity(v)}
                                aria-label={t("density")}
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>{t("compact")}</span>
                                <span>{t("roomy")}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={runAutoFit} disabled={fit.isFitting}>
                                <WandSparkles className="size-3.5" />
                                {t("autoFit")}
                            </Button>
                        </PopoverContent>
                    </Popover>

                    {/* Zoom */}
                    <div className="flex items-center rounded-lg border bg-background">
                        <Button size="icon-xs" variant="ghost" onClick={() => stepZoom(-ZOOM_STEP)} aria-label="Zoom out">
                            <Minus className="size-3" />
                        </Button>
                        <span className="w-10 text-center text-[11px] tabular-nums text-muted-foreground">{percent}%</span>
                        <Button size="icon-xs" variant="ghost" onClick={() => stepZoom(ZOOM_STEP)} aria-label="Zoom in">
                            <Plus className="size-3" />
                        </Button>
                        <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => setZoom("fit")}
                            aria-label={t("fit")}
                            aria-pressed={zoom === "fit"}
                            className={cn(zoom === "fit" && "text-primary")}
                        >
                            <Maximize2 className="size-3" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Scrollable stage ── */}
            <div
                ref={previewContainerRef}
                className="cv-scale-outer min-h-0 flex-1 overflow-auto overscroll-contain px-3 py-5 sm:px-6 sm:py-8"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="cv-scale-box mx-auto"
                    style={{ width: scaledWidth, height: scaledHeight }}
                >
                    <div
                        className="cv-scale-wrap origin-top-left shadow-2xl"
                        style={{ width: SHEET_W, transform: `scale(${scale})` }}
                    >
                        <CVPreview
                            cv={cv}
                            cvRef={cvRef}
                            contentRef={contentRef}
                            accentColor={prefs.accentColor}
                            density={prefs.density}
                            showSpill={!fit.fits}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
