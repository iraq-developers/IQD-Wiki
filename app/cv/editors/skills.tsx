"use client";

import React from "react";
import { Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionHeader, Field, EmptyState, AddButton, RowActions, fieldCls, type EditorCtx } from "./shared";
import { move, removeAt, updateById } from "../list-utils";
import { makeSkill } from "../types";

/* ══════════════════════════════════════════════════════
   SKILLS — grouped by category
══════════════════════════════════════════════════════ */

export function SkillsEditor({ cv, upd, updNow, t }: EditorCtx) {
    const skills = cv.skills;

    return (
        <div className="space-y-4">
            <SectionHeader title={t("secSkills")} hint={t("hintSkills")} />

            <Field label={t("sectionTitle")}>
                <Input value={cv.skillsTitle} onChange={e => upd("skillsTitle", e.target.value)} className={fieldCls} />
            </Field>

            {skills.length === 0 ? (
                <EmptyState title={t("emptySkills")} hint={t("hintSkills")} icon={Wrench} />
            ) : (
                <div className="space-y-2">
                    {skills.map((skill, i) => (
                        <div key={skill.id} className="space-y-2 rounded-lg border bg-muted/20 p-2.5">
                            <div className="flex items-center gap-1.5">
                                <Input
                                    value={skill.label}
                                    onChange={e => upd("skills", updateById(skills, skill.id, { label: e.target.value }))}
                                    className={`w-28 shrink-0 font-medium ${fieldCls}`}
                                    placeholder={t("category")}
                                    aria-label={t("category")}
                                />
                                <RowActions
                                    index={i}
                                    count={skills.length}
                                    onMove={to => updNow("skills", move(skills, i, to))}
                                    onRemove={() => updNow("skills", removeAt(skills, i))}
                                    t={t}
                                    className="ms-auto"
                                />
                            </div>
                            <Input
                                value={skill.value}
                                onChange={e => upd("skills", updateById(skills, skill.id, { value: e.target.value }))}
                                className={fieldCls}
                                placeholder="React, Next.js, TypeScript…"
                                aria-label={skill.label || t("category")}
                            />
                        </div>
                    ))}
                </div>
            )}

            <AddButton
                label={t("addSkillGroup")}
                onClick={() => updNow("skills", [...skills, makeSkill("", "")])}
            />
        </div>
    );
}
