"use client";

import React from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, Wrench, Briefcase, FolderOpen, GraduationCap, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHeader, type EditorCtx } from "./shared";
import { move } from "../list-utils";
import type { SectionId } from "../types";

/* ══════════════════════════════════════════════════════
   LAYOUT — reorder and hide the CV's body sections
══════════════════════════════════════════════════════ */

const SECTION_META: Record<SectionId, { icon: React.ComponentType<{ className?: string }>; key: "secSkills" | "secExperience" | "secProjects" | "secEducation" | "secLanguages" }> = {
    skills: { icon: Wrench, key: "secSkills" },
    experience: { icon: Briefcase, key: "secExperience" },
    projects: { icon: FolderOpen, key: "secProjects" },
    education: { icon: GraduationCap, key: "secEducation" },
    languages: { icon: Languages, key: "secLanguages" },
};

/** How many entries each section currently holds — hidden or empty sections
    never render on the sheet, so it helps to surface the count here. */
function useCounts(cv: EditorCtx["cv"]): Record<SectionId, number> {
    return {
        skills: cv.skills.length,
        experience: cv.jobs.length,
        projects: cv.projects.length,
        education: cv.education.length,
        languages: cv.languages.length,
    };
}

export function LayoutSectionsEditor({ cv, updNow, t, go }: EditorCtx) {
    const sections = cv.sections;
    const counts = useCounts(cv);

    return (
        <div className="space-y-4">
            <SectionHeader title={t("secLayout")} hint={t("hintLayout")} />

            <div className="space-y-1.5">
                {sections.map((s, i) => {
                    const meta = SECTION_META[s.id];
                    const Icon = meta.icon;
                    const count = counts[s.id];
                    return (
                        <div
                            key={s.id}
                            className={cn(
                                "flex items-center gap-1 rounded-lg border py-1 pe-1 ps-2.5 transition-opacity",
                                !s.visible && "opacity-55"
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => go(s.id === "experience" ? "experience" : s.id)}
                                className="flex min-w-0 flex-1 items-center gap-2 py-2 text-start"
                            >
                                <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate text-sm">{t(meta.key)}</span>
                                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{count}</span>
                            </button>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => updNow("sections", sections.map((x, xi) => xi === i ? { ...x, visible: !x.visible } : x))}
                                aria-label={s.visible ? t("hide") : t("show")}
                                title={s.visible ? t("hide") : t("show")}
                                aria-pressed={s.visible}
                            >
                                {s.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => updNow("sections", move(sections, i, i - 1))}
                                disabled={i === 0}
                                aria-label={t("moveUp")}
                                title={t("moveUp")}
                            >
                                <ChevronUp className="size-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => updNow("sections", move(sections, i, i + 1))}
                                disabled={i === sections.length - 1}
                                aria-label={t("moveDown")}
                                title={t("moveDown")}
                            >
                                <ChevronDown className="size-3.5" />
                            </Button>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-muted-foreground">
                The header — name, title and contact details — always stays at the top.
            </p>
        </div>
    );
}
