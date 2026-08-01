"use client";

import React from "react";
import { GraduationCap, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionHeader, Field, EmptyState, AddButton, RowActions, fieldCls, type EditorCtx } from "./shared";
import { move, removeAt, updateById } from "../list-utils";
import { makeSimple, type Simple } from "../types";
import type { TFunc } from "../i18n";

/* ══════════════════════════════════════════════════════
   EDUCATION & LANGUAGES — plain one-line entries
══════════════════════════════════════════════════════ */

function SimpleListEditor({
    items,
    onChange,
    onStructuralChange,
    placeholder,
    t,
}: {
    items: Simple[];
    onChange: (v: Simple[]) => void;
    onStructuralChange: (v: Simple[]) => void;
    placeholder: string;
    t: TFunc;
}) {
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={item.id} className="flex items-center gap-1.5">
                    <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground">{i + 1}.</span>
                    <Input
                        value={item.text}
                        onChange={e => onChange(updateById(items, item.id, { text: e.target.value }))}
                        className={`min-w-0 flex-1 ${fieldCls}`}
                        placeholder={placeholder}
                    />
                    <RowActions
                        index={i}
                        count={items.length}
                        onMove={to => onStructuralChange(move(items, i, to))}
                        onRemove={() => onStructuralChange(removeAt(items, i))}
                        t={t}
                    />
                </div>
            ))}
            <AddButton label={t("addEntry")} onClick={() => onStructuralChange([...items, makeSimple("")])} />
        </div>
    );
}

export function EducationEditor({ cv, upd, updNow, t }: EditorCtx) {
    return (
        <div className="space-y-4">
            <SectionHeader title={t("secEducation")} />
            <Field label={t("sectionTitle")}>
                <Input value={cv.eduTitle} onChange={e => upd("eduTitle", e.target.value)} className={fieldCls} />
            </Field>
            {cv.education.length === 0 && <EmptyState title={t("emptyList")} icon={GraduationCap} />}
            <SimpleListEditor
                items={cv.education}
                onChange={v => upd("education", v)}
                onStructuralChange={v => updNow("education", v)}
                placeholder="Degree — University, City (Year – Year)"
                t={t}
            />
        </div>
    );
}

export function LanguagesEditor({ cv, upd, updNow, t }: EditorCtx) {
    return (
        <div className="space-y-4">
            <SectionHeader title={t("secLanguages")} />
            <Field label={t("sectionTitle")}>
                <Input value={cv.langTitle} onChange={e => upd("langTitle", e.target.value)} className={fieldCls} />
            </Field>
            {cv.languages.length === 0 && <EmptyState title={t("emptyList")} icon={Languages} />}
            <SimpleListEditor
                items={cv.languages}
                onChange={v => upd("languages", v)}
                onStructuralChange={v => updNow("languages", v)}
                placeholder="Language (Proficiency)"
                t={t}
            />
        </div>
    );
}
