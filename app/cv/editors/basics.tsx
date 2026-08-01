"use client";

import React from "react";
import { Link2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionHeader, Field, EmptyState, CharCount, fieldCls, type EditorCtx } from "./shared";
import { LinkListEditor } from "./list-editors";

/* ══════════════════════════════════════════════════════
   PERSONAL INFO · LINKS · SUMMARY
══════════════════════════════════════════════════════ */

export function PersonalInfoEditor({ cv, upd, t }: EditorCtx) {
    return (
        <div className="space-y-4">
            <SectionHeader title={t("secPersonal")} hint={t("hintPersonal")} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label={t("fullName")} htmlFor="cv-name" className="sm:col-span-2">
                    <Input
                        id="cv-name"
                        value={cv.name}
                        onChange={e => upd("name", e.target.value)}
                        className={fieldCls}
                        placeholder="JOHN DOE"
                        autoComplete="name"
                    />
                </Field>
                <Field label={t("jobTitle")} htmlFor="cv-title" className="sm:col-span-2">
                    <Input
                        id="cv-title"
                        value={cv.titleLine}
                        onChange={e => upd("titleLine", e.target.value)}
                        className={fieldCls}
                        placeholder="Frontend Developer"
                    />
                </Field>
                <Field label={t("phone")} htmlFor="cv-phone">
                    <Input
                        id="cv-phone"
                        value={cv.phone}
                        onChange={e => upd("phone", e.target.value)}
                        className={fieldCls}
                        placeholder="+964 770 000 0000"
                        inputMode="tel"
                        autoComplete="tel"
                    />
                </Field>
                <Field label={t("location")} htmlFor="cv-location">
                    <Input
                        id="cv-location"
                        value={cv.location}
                        onChange={e => upd("location", e.target.value)}
                        className={fieldCls}
                        placeholder="Baghdad, Iraq"
                    />
                </Field>
                <Field label={t("email")} htmlFor="cv-email" className="sm:col-span-2">
                    <Input
                        id="cv-email"
                        value={cv.email}
                        onChange={e => upd("email", e.target.value)}
                        className={fieldCls}
                        placeholder="you@example.com"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
                </Field>
            </div>
        </div>
    );
}

export function LinksEditor({ cv, updNow, t }: EditorCtx) {
    return (
        <div className="space-y-4">
            <SectionHeader title={t("secLinks")} hint={t("hintLinks")} />
            {cv.links.length === 0 && (
                <EmptyState title={t("emptyLinks")} hint={t("hintLinks")} icon={Link2} />
            )}
            <LinkListEditor links={cv.links} onChange={links => updNow("links", links)} t={t} />
        </div>
    );
}

export function SummaryEditor({ cv, upd, t, askAI }: EditorCtx) {
    return (
        <div className="space-y-3">
            <SectionHeader
                title={t("secSummary")}
                hint={t("hintSummary")}
                action={
                    askAI && (
                        <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => askAI("summary", cv.summary)}
                            title={t("aiImproveHint")}
                        >
                            <Sparkles className="size-3" /> {t("aiImprove")}
                        </Button>
                    )
                }
            />
            <Textarea
                value={cv.summary}
                onChange={e => upd("summary", e.target.value)}
                rows={7}
                className={`resize-y ${fieldCls}`}
                placeholder="Frontend developer with 3 years of experience building…"
            />
            <CharCount value={cv.summary} ideal={420} />
        </div>
    );
}
