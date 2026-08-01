"use client";

import React from "react";
import { ChevronUp, ChevronDown, Copy, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CVData } from "../types";
import type { TFunc } from "../i18n";

/* ══════════════════════════════════════════════════════
   SHARED EDITOR PRIMITIVES
══════════════════════════════════════════════════════ */

/** 16px on touch screens so iOS Safari never zooms the viewport on focus. */
export const fieldCls = "text-base sm:text-sm";

export interface EditorCtx {
    cv: CVData;
    /** Text edits — collapse into one undo step while typing. */
    upd: <K extends keyof CVData>(k: K, v: CVData[K]) => void;
    /** Structural edits (add / delete / reorder) — always their own undo step. */
    updNow: <K extends keyof CVData>(k: K, v: CVData[K]) => void;
    t: TFunc;
    /** Navigate the panel to another section id. */
    go: (id: string) => void;
    /** Copy a focused "improve this" prompt for one field. */
    askAI?: (field: string, current: string) => void;
}

export function SectionHeader({
    title,
    hint,
    action,
}: {
    title: string;
    hint?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-4">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            <Separator className="mt-3" />
        </div>
    );
}

export function Field({
    label,
    htmlFor,
    hint,
    children,
    className,
}: {
    label: string;
    htmlFor?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <Label htmlFor={htmlFor} className="text-xs font-medium">{label}</Label>
            {children}
            {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
    );
}

/* ── Reorder / duplicate / delete controls ─────────────
   One component so every list in the builder behaves the
   same way — and so all of it works by tap and keyboard,
   which drag-and-drop would not.                        */
export function RowActions({
    index,
    count,
    onMove,
    onDuplicate,
    onRemove,
    t,
    className,
    orientation = "horizontal",
}: {
    index: number;
    count: number;
    onMove: (to: number) => void;
    onDuplicate?: () => void;
    onRemove: () => void;
    t: TFunc;
    className?: string;
    orientation?: "horizontal" | "vertical";
}) {
    return (
        <div className={cn("flex shrink-0 items-center gap-0.5", orientation === "vertical" && "flex-col", className)}>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onMove(index - 1)}
                disabled={index === 0}
                aria-label={t("moveUp")}
                title={t("moveUp")}
            >
                <ChevronUp className="size-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onMove(index + 1)}
                disabled={index >= count - 1}
                aria-label={t("moveDown")}
                title={t("moveDown")}
            >
                <ChevronDown className="size-3.5" />
            </Button>
            {onDuplicate && (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onDuplicate}
                    aria-label={t("duplicate")}
                    title={t("duplicate")}
                >
                    <Copy className="size-3.5" />
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={onRemove}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={t("remove")}
                title={t("remove")}
            >
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={onClick}>
            <Plus className="size-3.5" /> {label}
        </Button>
    );
}

export function EmptyState({
    title,
    hint,
    icon: Icon,
}: {
    title: string;
    hint?: string;
    icon?: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="rounded-lg border border-dashed px-4 py-8 text-center">
            {Icon && <Icon className="mx-auto mb-2 size-6 text-muted-foreground/60" />}
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {hint && <p className="mx-auto mt-1 max-w-[36ch] text-xs text-muted-foreground/80">{hint}</p>}
        </div>
    );
}

/** Soft length guidance tied to the one-page budget. */
export function CharCount({ value, ideal }: { value: string; ideal?: number }) {
    const over = ideal !== undefined && value.length > ideal;
    return (
        <p className={cn("text-[11px] tabular-nums", over ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground")}>
            {value.length}
            {ideal !== undefined && ` / ~${ideal}`} characters
        </p>
    );
}
