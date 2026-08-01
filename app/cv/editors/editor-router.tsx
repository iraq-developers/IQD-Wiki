"use client";

import React from "react";
import {
    User, Briefcase, FolderOpen, GraduationCap, Languages,
    Wrench, Link2, FileText, LayoutList,
} from "lucide-react";
import type { TreeDataItem } from "@/components/tree-view";
import type { CVData } from "../types";
import type { TFunc } from "../i18n";
import type { EditorCtx } from "./shared";
import { PersonalInfoEditor, LinksEditor, SummaryEditor } from "./basics";
import { SkillsEditor } from "./skills";
import { AllJobsEditor, JobEditor } from "./jobs";
import { AllProjectsEditor, ProjectEditor } from "./projects";
import { EducationEditor, LanguagesEditor } from "./simple-lists";
import { LayoutSectionsEditor } from "./layout-sections";

/* ══════════════════════════════════════════════════════
   NAVIGATION + ROUTING

   One source of truth for "which section is selected", so
   the desktop tree and the mobile drawer never disagree.
══════════════════════════════════════════════════════ */

export const ROOT_SECTIONS = [
    { id: "personal", icon: User, key: "secPersonal" },
    { id: "links", icon: Link2, key: "secLinks" },
    { id: "summary", icon: FileText, key: "secSummary" },
    { id: "skills", icon: Wrench, key: "secSkills" },
    { id: "experience", icon: Briefcase, key: "secExperience" },
    { id: "projects", icon: FolderOpen, key: "secProjects" },
    { id: "education", icon: GraduationCap, key: "secEducation" },
    { id: "languages", icon: Languages, key: "secLanguages" },
    { id: "layout", icon: LayoutList, key: "secLayout" },
] as const;

type RootKey = (typeof ROOT_SECTIONS)[number]["key"];

export function buildTreeData(cv: CVData, t: TFunc): TreeDataItem[] {
    return ROOT_SECTIONS.map(s => {
        const base: TreeDataItem = { id: s.id, name: t(s.key as RootKey), icon: s.icon };
        if (s.id === "experience" && cv.jobs.length) {
            return {
                ...base,
                children: cv.jobs.map(job => ({
                    id: `job-${job.id}`,
                    name: job.title || t("emptyJobs"),
                    icon: Briefcase,
                })),
            };
        }
        if (s.id === "projects" && cv.projects.length) {
            return {
                ...base,
                children: cv.projects.map(p => ({
                    id: `proj-${p.id}`,
                    name: p.name || t("emptyProjects"),
                    icon: FolderOpen,
                })),
            };
        }
        return base;
    });
}

/** Human label for whichever id is selected — used by the mobile section button. */
export function labelForSelection(selectedId: string, cv: CVData, t: TFunc): string {
    if (selectedId.startsWith("job-")) {
        const job = cv.jobs.find(j => j.id === selectedId.slice(4));
        return job?.title || t("secExperience");
    }
    if (selectedId.startsWith("proj-")) {
        const proj = cv.projects.find(p => p.id === selectedId.slice(5));
        return proj?.name || t("secProjects");
    }
    const root = ROOT_SECTIONS.find(s => s.id === selectedId);
    return root ? t(root.key as RootKey) : t("secPersonal");
}

/** Resolve a selection to a live entry, falling back when it was deleted. */
export function resolveSelection(selectedId: string, cv: CVData): string {
    if (selectedId.startsWith("job-")) {
        return cv.jobs.some(j => j.id === selectedId.slice(4)) ? selectedId : "experience";
    }
    if (selectedId.startsWith("proj-")) {
        return cv.projects.some(p => p.id === selectedId.slice(5)) ? selectedId : "projects";
    }
    return ROOT_SECTIONS.some(s => s.id === selectedId) ? selectedId : "personal";
}

export function EditorRouter({ selectedId, ctx }: { selectedId: string; ctx: EditorCtx }) {
    const { cv } = ctx;

    if (selectedId.startsWith("job-")) {
        const job = cv.jobs.find(j => j.id === selectedId.slice(4));
        if (job) return <JobEditor job={job} ctx={ctx} />;
        return <AllJobsEditor {...ctx} />;
    }

    if (selectedId.startsWith("proj-")) {
        const project = cv.projects.find(p => p.id === selectedId.slice(5));
        if (project) return <ProjectEditor project={project} ctx={ctx} />;
        return <AllProjectsEditor {...ctx} />;
    }

    switch (selectedId) {
        case "personal": return <PersonalInfoEditor {...ctx} />;
        case "links": return <LinksEditor {...ctx} />;
        case "summary": return <SummaryEditor {...ctx} />;
        case "skills": return <SkillsEditor {...ctx} />;
        case "experience": return <AllJobsEditor {...ctx} />;
        case "projects": return <AllProjectsEditor {...ctx} />;
        case "education": return <EducationEditor {...ctx} />;
        case "languages": return <LanguagesEditor {...ctx} />;
        case "layout": return <LayoutSectionsEditor {...ctx} />;
        default: return <PersonalInfoEditor {...ctx} />;
    }
}
