"use client";

import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCVBuilder } from "./hooks/use-cv-builder";
import { useMounted } from "./hooks/use-mounted";
import { CVSheetStyles } from "./preview/cv-preview";
import { DesktopShell } from "./shells/desktop-shell";
import { MobileShell } from "./shells/mobile-shell";
import { resolveSelection } from "./editors/editor-router";
import { buildFieldPrompt, PROVIDERS } from "./ai/prompts";
import type { EditorCtx } from "./editors/shared";

/* ══════════════════════════════════════════════════════
   CV BUILDER PAGE

   Composition only: pick a shell, build the editor
   context, and hand both the same builder instance.
══════════════════════════════════════════════════════ */

export default function CVPage() {
    const builder = useCVBuilder();
    const isMobile = useIsMobile();
    /* Both the shell choice and the stored CV resolve on the client, so one
       shared skeleton covers them — no hydration mismatch, and no flash of the
       desktop layout on a phone. */
    const mounted = useMounted();
    const [selectedId, setSelectedId] = useState("personal");

    const { cv, upd, updNow, t, prefs, hydrated } = builder;

    /* If the selected job or project was deleted, fall back to its list.
       Derived during render rather than synced in an effect, so the panel
       never paints a missing entry. */
    const resolvedId = useMemo(() => resolveSelection(selectedId, cv), [selectedId, cv]);

    /* ── Field-level AI: copy a focused prompt, offer to open a provider ── */
    const askAI = useCallback((field: string, current: string) => {
        const prompt = buildFieldPrompt(field, current, prefs.uiLang, cv);
        navigator.clipboard.writeText(prompt).then(
            () => toast.success(t("aiCopiedToast"), {
                action: {
                    label: PROVIDERS[0].name,
                    onClick: () => window.open(PROVIDERS[0].url, "_blank", "noopener,noreferrer"),
                },
            }),
            () => toast.error(t("exportFailed"))
        );
    }, [cv, prefs.uiLang, t]);

    const ctx: EditorCtx = useMemo(
        () => ({ cv, upd, updNow, t, go: setSelectedId, askAI }),
        [cv, upd, updNow, t, askAI]
    );

    const ready = mounted && hydrated;

    return (
        <>
            <CVSheetStyles />

            <div
                className="h-[100dvh] w-full overflow-hidden bg-background text-foreground"
                dir={prefs.uiLang === "ar" ? "rtl" : "ltr"}
            >
                {!ready ? (
                    <LoadingSkeleton />
                ) : isMobile ? (
                    <MobileShell builder={builder} ctx={ctx} selectedId={resolvedId} onSelect={setSelectedId} />
                ) : (
                    <DesktopShell builder={builder} ctx={ctx} selectedId={resolvedId} onSelect={setSelectedId} />
                )}
            </div>
        </>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex h-full items-center justify-center bg-muted/40">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
                <p className="text-sm">CV Builder</p>
            </div>
        </div>
    );
}
