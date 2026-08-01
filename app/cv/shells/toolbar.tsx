"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import {
    Undo2, Redo2, Download, Printer, FileImage, FileText, Check, Loader2,
    Settings2, RotateCcw, FilePlus2, Upload, Languages as LanguagesIcon, Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { normalizeCV } from "../cv-schema";
import type { UILang } from "../i18n";
import type { CVBuilder } from "../hooks/use-cv-builder";

/* ══════════════════════════════════════════════════════
   TOOLBAR PIECES
   Composed differently by the desktop and mobile shells.
══════════════════════════════════════════════════════ */

export function SaveIndicator({ builder, className }: { builder: CVBuilder; className?: string }) {
    const { saveState, t } = builder;
    if (saveState === "idle") return null;
    return (
        <span
            className={cn("inline-flex items-center gap-1 text-[11px] text-muted-foreground", className)}
            title={t("savedHint")}
        >
            {saveState === "saving"
                ? <Cloud className="size-3 animate-pulse" />
                : <Check className="size-3 text-emerald-600 dark:text-emerald-500" />}
            <span className="hidden sm:inline">{saveState === "saving" ? t("saving") : t("saved")}</span>
        </span>
    );
}

export function UndoRedo({ builder }: { builder: CVBuilder }) {
    const { undo, redo, canUndo, canRedo, t } = builder;
    return (
        <div className="flex items-center">
            <Button variant="ghost" size="icon-sm" onClick={undo} disabled={!canUndo} aria-label={t("undo")} title={`${t("undo")} (Ctrl+Z)`}>
                <Undo2 className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo} aria-label={t("redo")} title={`${t("redo")} (Ctrl+Shift+Z)`}>
                <Redo2 className="size-3.5" />
            </Button>
        </div>
    );
}

export function ExportMenu({ builder, full = false }: { builder: CVBuilder; full?: boolean }) {
    const { t, isExporting, exportPDF, exportPNG, printCV } = builder;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="default" disabled={isExporting}>
                    {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                    <span className={cn(!full && "hidden sm:inline")}>
                        {isExporting ? t("exporting") : t("export")}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t("export")}</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => void printCV()}>
                    <Printer className="size-4" />
                    <div className="flex min-w-0 flex-col">
                        <span>{t("print")}</span>
                        <span className="text-[11px] text-muted-foreground">{t("printHint")}</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void exportPDF()}>
                    <FileText className="size-4" />
                    <div className="flex min-w-0 flex-col">
                        <span>{t("exportPdf")}</span>
                        <span className="text-[11px] text-muted-foreground">{t("pdfHint")}</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void exportPNG()}>
                    <FileImage className="size-4" />
                    <div className="flex min-w-0 flex-col">
                        <span>{t("exportPng")}</span>
                        <span className="text-[11px] text-muted-foreground">{t("pngHint")}</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ── Settings: language, backup / restore, reset ── */
export function SettingsMenu({ builder }: { builder: CVBuilder }) {
    const { t, cv, prefs, setPrefs, replaceCV, resetToSample, resetToBlank } = builder;
    const fileRef = useRef<HTMLInputElement>(null);
    const [confirm, setConfirm] = React.useState<null | "sample" | "blank">(null);

    const downloadBackup = () => {
        const blob = new Blob([JSON.stringify({ v: 1, cv, prefs }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cv-backup.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const restoreBackup = async (file: File) => {
        try {
            const text = await file.text();
            const parsed = JSON.parse(text) as { cv?: unknown } | unknown;
            const source = (parsed && typeof parsed === "object" && "cv" in parsed)
                ? (parsed as { cv: unknown }).cv
                : parsed;
            const { cv: restored, warnings } = normalizeCV(source);
            replaceCV(restored);
            toast.success(t("importedOk"), {
                description: warnings.length ? warnings[0] : undefined,
            });
        } catch {
            toast.error(t("importFailed"));
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-sm" aria-label={t("more")} title={t("more")}>
                        <Settings2 className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel className="flex items-center gap-1.5">
                        <LanguagesIcon className="size-3.5" /> {t("language")}
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={prefs.uiLang}
                        onValueChange={v => setPrefs({ uiLang: v as UILang })}
                    >
                        <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="ar">العربية</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{t("data")}</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={downloadBackup}>
                        <Download className="size-4" /> {t("downloadJson")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                        <Upload className="size-4" /> {t("uploadJson")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setConfirm("sample")}>
                        <RotateCcw className="size-4" /> {t("resetSample")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setConfirm("blank")}>
                        <FilePlus2 className="size-4" /> {t("resetBlank")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) void restoreBackup(file);
                    e.target.value = "";
                }}
            />

            <AlertDialog open={confirm !== null} onOpenChange={open => !open && setConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("resetTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("resetBody")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (confirm === "sample") resetToSample();
                                else resetToBlank();
                                setConfirm(null);
                            }}
                        >
                            {t("resetConfirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
