"use client";

import React from "react";
import { ArrowRight, AlertTriangle, Replace, GitMerge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { diffCV } from "../cv-schema";
import type { CVData } from "../types";
import type { TFunc } from "../i18n";

/* ══════════════════════════════════════════════════════
   REVIEW CHANGES — nothing is applied until the user
   picks Replace or Merge.
══════════════════════════════════════════════════════ */

export function ReviewChanges({
    current,
    incoming,
    warnings,
    t,
    onReplace,
    onMerge,
    onCancel,
}: {
    current: CVData;
    incoming: CVData;
    warnings: string[];
    t: TFunc;
    onReplace: () => void;
    onMerge: () => void;
    onCancel: () => void;
}) {
    const rows = diffCV(current, incoming);
    const changed = rows.filter(r => r.changed);

    return (
        <div className="flex min-h-0 flex-col gap-4">
            <div>
                <h4 className="text-sm font-semibold">{t("reviewTitle")}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{t("reviewSubtitle")}</p>
            </div>

            {changed.length === 0 && (
                <p className="rounded-lg border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
                    {t("reviewNoChange")}
                </p>
            )}

            {warnings.length > 0 && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-500">
                        <AlertTriangle className="size-3.5" /> {t("reviewWarnings")}
                    </p>
                    <ul className="mt-1.5 space-y-0.5 ps-5 text-xs text-amber-800/90 dark:text-amber-500/90">
                        {warnings.map(w => <li key={w} className="list-disc">{w}</li>)}
                    </ul>
                </div>
            )}

            {changed.length > 0 && (
                <div className="min-h-0 overflow-y-auto rounded-lg border">
                    <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                            <tr className="text-start text-[11px] uppercase tracking-wide text-muted-foreground">
                                <th className="px-3 py-1.5 text-start font-medium">{t("reviewField")}</th>
                                <th className="px-2 py-1.5 text-start font-medium">{t("reviewBefore")}</th>
                                <th className="px-3 py-1.5 text-start font-medium">{t("reviewAfter")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {changed.map(row => (
                                <tr key={row.label} className="border-t align-top">
                                    <td className="px-3 py-1.5 font-medium">{row.label}</td>
                                    <td className="max-w-[14ch] truncate px-2 py-1.5 text-muted-foreground" title={row.before}>
                                        {row.before}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <span className="inline-flex items-center gap-1">
                                            <ArrowRight className="size-3 shrink-0 text-muted-foreground rtl:rotate-180" />
                                            <span className="truncate font-medium" title={row.after}>{row.after}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
                <ChoiceButton
                    icon={Replace}
                    title={t("reviewReplace")}
                    hint={t("reviewReplaceHint")}
                    onClick={onReplace}
                    primary
                />
                <ChoiceButton
                    icon={GitMerge}
                    title={t("reviewMerge")}
                    hint={t("reviewMergeHint")}
                    onClick={onMerge}
                />
            </div>

            <Button variant="ghost" size="sm" onClick={onCancel} className="self-center">
                {t("cancel")}
            </Button>
        </div>
    );
}

function ChoiceButton({
    icon: Icon,
    title,
    hint,
    onClick,
    primary,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    hint: string;
    onClick: () => void;
    primary?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "rounded-lg border p-3 text-start transition-colors",
                primary
                    ? "border-primary/40 bg-primary/10 hover:bg-primary/20"
                    : "hover:bg-muted"
            )}
        >
            <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Icon className="size-3.5" /> {title}
            </span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">{hint}</span>
        </button>
    );
}
