"use client";

import React, { useState } from "react";
import { PencilLine, Eye, ChevronDown, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { PreviewStage } from "../preview/preview-stage";
import { EditorRouter, ROOT_SECTIONS, labelForSelection } from "../editors/editor-router";
import { AIBuilderDialog } from "../ai/ai-dialog";
import { ColorPicker } from "../color-picker";
import { SaveIndicator, UndoRedo, ExportMenu, SettingsMenu } from "./toolbar";
import type { EditorCtx } from "../editors/shared";
import type { CVBuilder } from "../hooks/use-cv-builder";

/* ══════════════════════════════════════════════════════
   MOBILE SHELL

   No split panes — one thing at a time. A segmented
   Edit ⇄ Preview switch at the bottom (thumb reach, above
   the home indicator) and a drawer for section navigation.
══════════════════════════════════════════════════════ */

type Tab = "edit" | "preview";

export function MobileShell({
    builder,
    ctx,
    selectedId,
    onSelect,
}: {
    builder: CVBuilder;
    ctx: EditorCtx;
    selectedId: string;
    onSelect: (id: string) => void;
}) {
    const [tab, setTab] = useState<Tab>("edit");
    const [navOpen, setNavOpen] = useState(false);
    const { cv, t, prefs, setAccentColor, replaceCV, fit } = builder;

    const go = (id: string) => {
        onSelect(id);
        setNavOpen(false);
        setTab("edit");
    };

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* ── Top bar ── */}
            <header className="flex shrink-0 items-center gap-1.5 border-b px-2 py-1.5">
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold leading-tight">{t("appTitle")}</span>
                    <SaveIndicator builder={builder} />
                </div>
                <div className="ms-auto flex items-center gap-1">
                    <UndoRedo builder={builder} />
                    <ColorPicker accentColor={prefs.accentColor} onChange={setAccentColor} t={t} />
                    <SettingsMenu builder={builder} />
                    <ExportMenu builder={builder} />
                </div>
            </header>

            {/* ── Section picker (edit mode only) ── */}
            {tab === "edit" && (
                <Drawer open={navOpen} onOpenChange={setNavOpen}>
                    <DrawerTrigger asChild>
                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 border-b bg-muted/40 px-3 py-2.5 text-start active:bg-muted"
                        >
                            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                {t("section")}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                {labelForSelection(selectedId, cv, t)}
                            </span>
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                    </DrawerTrigger>

                    <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[80dvh]">
                        <DrawerHeader className="text-start">
                            <DrawerTitle>{t("sections")}</DrawerTitle>
                        </DrawerHeader>
                        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            {ROOT_SECTIONS.map(s => {
                                const Icon = s.icon;
                                const active = selectedId === s.id
                                    || (s.id === "experience" && selectedId.startsWith("job-"))
                                    || (s.id === "projects" && selectedId.startsWith("proj-"));
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => go(s.id)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-start text-sm active:bg-muted",
                                            active && "bg-muted font-medium"
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                                        <span className="min-w-0 flex-1 truncate">{t(s.key)}</span>
                                        {active && <Check className="size-4 shrink-0 text-primary" />}
                                    </button>
                                );
                            })}

                            <DrawerClose asChild>
                                <Button variant="ghost" size="sm" className="mt-2 w-full">
                                    {t("close")}
                                </Button>
                            </DrawerClose>
                        </nav>
                    </DrawerContent>
                </Drawer>
            )}

            {/* ── Content ── */}
            <main className="min-h-0 flex-1">
                {tab === "edit" ? (
                    <div className="h-full overflow-y-auto overscroll-contain px-3 pb-8 pt-4">
                        <EditorRouter selectedId={selectedId} ctx={ctx} />

                        <div className="mt-8 border-t pt-4">
                            <AIBuilderDialog
                                cv={cv}
                                replaceCV={replaceCV}
                                t={t}
                                uiLang={prefs.uiLang}
                                trigger={
                                    <Button variant="secondary" className="w-full">
                                        <Sparkles className="size-4" /> {t("aiBuilder")}
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <PreviewStage builder={builder} compact />
                )}
            </main>

            {/* ── Bottom switch ── */}
            <nav
                className="shrink-0 border-t bg-background/95 px-3 pt-2 backdrop-blur"
                style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
            >
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                    <TabButton
                        active={tab === "edit"}
                        onClick={() => setTab("edit")}
                        icon={PencilLine}
                        label={t("edit")}
                    />
                    <TabButton
                        active={tab === "preview"}
                        onClick={() => setTab("preview")}
                        icon={Eye}
                        label={t("preview")}
                        badge={!fit.fits}
                    />
                </div>
            </nav>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon: Icon,
    label,
    badge,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "relative flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
        >
            <Icon className="size-4" />
            {label}
            {badge && (
                <span
                    className="absolute end-2 top-2 size-1.5 rounded-full bg-destructive"
                    aria-label="Content exceeds one page"
                />
            )}
        </button>
    );
}
