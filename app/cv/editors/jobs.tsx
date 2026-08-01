"use client";

import React from "react";
import { Briefcase, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader, Field, EmptyState, AddButton, RowActions, fieldCls, type EditorCtx } from "./shared";
import { BulletListEditor } from "./list-editors";
import { ConfirmDelete } from "./confirm-delete";
import { move, removeAt, updateById, indexById, insertAt, cloneJob } from "../list-utils";
import { uid, makeBullet, type Job } from "../types";

/* ══════════════════════════════════════════════════════
   WORK EXPERIENCE
══════════════════════════════════════════════════════ */

const newJob = (): Job => ({
    id: uid(),
    title: "",
    bullets: [makeBullet("")],
});

/* ── The whole list ── */
export function AllJobsEditor({ cv, upd, updNow, t, go }: EditorCtx) {
    const jobs = cv.jobs;

    return (
        <div className="space-y-4">
            <SectionHeader title={t("secExperience")} hint={t("hintExperience")} />

            <Field label={t("sectionTitle")}>
                <Input value={cv.expTitle} onChange={e => upd("expTitle", e.target.value)} className={fieldCls} />
            </Field>

            {jobs.length === 0 ? (
                <EmptyState title={t("emptyJobs")} hint={t("emptyHint")} icon={Briefcase} />
            ) : (
                <div className="space-y-1.5">
                    {jobs.map((job, i) => (
                        <div key={job.id} className="group flex items-center gap-1 rounded-lg border px-1 py-1 pe-1 ps-2.5">
                            <button
                                type="button"
                                onClick={() => go(`job-${job.id}`)}
                                className="flex min-w-0 flex-1 items-center gap-2 py-2 text-start"
                            >
                                <Briefcase className="size-3.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate text-sm">
                                    {job.title || t("emptyJobs")}
                                </span>
                                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                                    {job.bullets.length}
                                </span>
                                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground rtl:rotate-180" />
                            </button>
                            <RowActions
                                index={i}
                                count={jobs.length}
                                onMove={to => updNow("jobs", move(jobs, i, to))}
                                onDuplicate={() => updNow("jobs", insertAt(jobs, i + 1, cloneJob(job)))}
                                onRemove={() => updNow("jobs", removeAt(jobs, i))}
                                t={t}
                            />
                        </div>
                    ))}
                </div>
            )}

            <AddButton
                label={t("addJob")}
                onClick={() => {
                    const job = newJob();
                    updNow("jobs", [...jobs, job]);
                    go(`job-${job.id}`);
                }}
            />
        </div>
    );
}

/* ── A single entry ── */
export function JobEditor({ job, ctx }: { job: Job; ctx: EditorCtx }) {
    const { cv, upd, updNow, t, go, askAI } = ctx;
    const jobs = cv.jobs;
    const index = indexById(jobs, job.id);

    const patch = (p: Partial<Job>) => upd("jobs", updateById(jobs, job.id, p));

    return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" className="-ms-2" onClick={() => go("experience")}>
                <ArrowLeft className="size-3.5 rtl:rotate-180" /> {t("secExperience")}
            </Button>

            <SectionHeader
                title={job.title || t("secExperience")}
                hint={`${index + 1} / ${jobs.length}`}
                action={
                    <ConfirmDelete
                        label={job.title || t("secExperience")}
                        t={t}
                        onConfirm={() => {
                            updNow("jobs", removeAt(jobs, index));
                            go("experience");
                        }}
                    />
                }
            />

            <Field label={t("titleAndCompany")} hint="e.g. Frontend Developer | Acme (2022 – Present)">
                <Input
                    value={job.title}
                    onChange={e => patch({ title: e.target.value })}
                    className={fieldCls}
                    placeholder="Role | Company (Year – Year)"
                />
            </Field>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{t("bulletPoints")}</span>
                    {askAI && (
                        <Button
                            size="xs"
                            variant="secondary"
                            title={t("aiImproveHint")}
                            onClick={() => askAI(
                                `work experience entry "${job.title}"`,
                                job.bullets.map(b => `- ${b.text}`).join("\n")
                            )}
                        >
                            <Sparkles className="size-3" /> {t("aiImprove")}
                        </Button>
                    )}
                </div>
                <BulletListEditor
                    bullets={job.bullets}
                    onChange={bullets => patch({ bullets })}
                    t={t}
                />
            </div>
        </div>
    );
}
