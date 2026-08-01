"use client";

import React from "react";
import { FolderOpen, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionHeader, Field, EmptyState, AddButton, RowActions, fieldCls, type EditorCtx } from "./shared";
import { BulletListEditor, LinkListEditor } from "./list-editors";
import { ConfirmDelete } from "./confirm-delete";
import { move, removeAt, updateById, indexById, insertAt, cloneProject } from "../list-utils";
import { uid, makeBullet, type Project } from "../types";

/* ══════════════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════════════ */

const newProject = (): Project => ({
    id: uid(),
    name: "",
    links: [],
    description: "",
    bullets: [makeBullet("")],
});

export function AllProjectsEditor({ cv, upd, updNow, t, go }: EditorCtx) {
    const projects = cv.projects;

    return (
        <div className="space-y-4">
            <SectionHeader title={t("secProjects")} hint={t("hintProjects")} />

            <Field label={t("sectionTitle")}>
                <Input value={cv.projTitle} onChange={e => upd("projTitle", e.target.value)} className={fieldCls} />
            </Field>

            {projects.length === 0 ? (
                <EmptyState title={t("emptyProjects")} hint={t("emptyHint")} icon={FolderOpen} />
            ) : (
                <div className="space-y-1.5">
                    {projects.map((proj, i) => (
                        <div key={proj.id} className="group flex items-center gap-1 rounded-lg border px-1 py-1 pe-1 ps-2.5">
                            <button
                                type="button"
                                onClick={() => go(`proj-${proj.id}`)}
                                className="flex min-w-0 flex-1 items-center gap-2 py-2 text-start"
                            >
                                <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate text-sm">
                                    {proj.name || t("emptyProjects")}
                                </span>
                                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                                    {proj.bullets.length}
                                </span>
                                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground rtl:rotate-180" />
                            </button>
                            <RowActions
                                index={i}
                                count={projects.length}
                                onMove={to => updNow("projects", move(projects, i, to))}
                                onDuplicate={() => updNow("projects", insertAt(projects, i + 1, cloneProject(proj)))}
                                onRemove={() => updNow("projects", removeAt(projects, i))}
                                t={t}
                            />
                        </div>
                    ))}
                </div>
            )}

            <AddButton
                label={t("addProject")}
                onClick={() => {
                    const proj = newProject();
                    updNow("projects", [...projects, proj]);
                    go(`proj-${proj.id}`);
                }}
            />
        </div>
    );
}

export function ProjectEditor({ project, ctx }: { project: Project; ctx: EditorCtx }) {
    const { cv, upd, updNow, t, go, askAI } = ctx;
    const projects = cv.projects;
    const index = indexById(projects, project.id);

    const patch = (p: Partial<Project>) => upd("projects", updateById(projects, project.id, p));

    return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" className="-ms-2" onClick={() => go("projects")}>
                <ArrowLeft className="size-3.5 rtl:rotate-180" /> {t("secProjects")}
            </Button>

            <SectionHeader
                title={project.name || t("secProjects")}
                hint={`${index + 1} / ${projects.length}`}
                action={
                    <ConfirmDelete
                        label={project.name || t("secProjects")}
                        t={t}
                        onConfirm={() => {
                            updNow("projects", removeAt(projects, index));
                            go("projects");
                        }}
                    />
                }
            />

            <Field label={t("projectName")}>
                <Input
                    value={project.name}
                    onChange={e => patch({ name: e.target.value })}
                    className={fieldCls}
                    placeholder="My Project"
                />
            </Field>

            <Field label={t("description")}>
                <Textarea
                    value={project.description}
                    onChange={e => patch({ description: e.target.value })}
                    rows={2}
                    className={`resize-y ${fieldCls}`}
                    placeholder="What does it do…"
                />
            </Field>

            <Field label={t("secLinks")}>
                <LinkListEditor links={project.links} onChange={links => patch({ links })} t={t} />
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
                                `project "${project.name}"`,
                                [project.description, ...project.bullets.map(b => `- ${b.text}`)].filter(Boolean).join("\n")
                            )}
                        >
                            <Sparkles className="size-3" /> {t("aiImprove")}
                        </Button>
                    )}
                </div>
                <BulletListEditor
                    bullets={project.bullets}
                    onChange={bullets => patch({ bullets })}
                    t={t}
                />
            </div>
        </div>
    );
}
