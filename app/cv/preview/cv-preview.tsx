"use client";

import React from "react";
import type { CVData, Link, SectionId } from "../types";
import { CV_SHEET_CSS } from "./sheet-styles";
import { SHEET_H } from "../hooks/use-cv-export";

/* ══════════════════════════════════════════════════════
   CV PREVIEW — the A4 sheet (read-only)

   Always laid out at exactly 794×1123 CSS px. Scaling for
   the viewport happens on a wrapper outside this component
   so exports stay pixel-identical.
══════════════════════════════════════════════════════ */

interface CVPreviewProps {
    cv: CVData;
    cvRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    accentColor: string;
    density: number;
    /** Let content spill visibly past the page edge instead of clipping it. */
    showSpill: boolean;
}

function PreviewLink({ link, separator }: { link: Link; separator?: string }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
            {separator && <span className="cp-sep">{separator}</span>}
            <a href={link.href} data-href={link.href} className="cp-link">
                {link.label}
            </a>
        </span>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="cp-section">
            <h2 className="cp-section-h2">{title}</h2>
            {children}
        </section>
    );
}

export function CVPreview({ cv, cvRef, contentRef, accentColor, density, showSpill }: CVPreviewProps) {
    const renderSection = (id: SectionId) => {
        switch (id) {
            case "skills":
                if (cv.skills.length === 0) return null;
                return (
                    <Section key={id} title={cv.skillsTitle}>
                        {cv.skills.map(skill => (
                            <p key={skill.id} className="cp-skills-row">
                                <span className="cp-skill-label">{skill.label}:</span> {skill.value}
                            </p>
                        ))}
                    </Section>
                );

            case "experience":
                if (cv.jobs.length === 0) return null;
                return (
                    <Section key={id} title={cv.expTitle}>
                        {cv.jobs.map(job => (
                            <div key={job.id} className="cp-block">
                                <h3 className="cp-block-title">{job.title}</h3>
                                {job.bullets.length > 0 && (
                                    <ul className="cp-ul">
                                        {job.bullets.map(b => (
                                            <li key={b.id} className="cp-li">{b.text}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </Section>
                );

            case "projects":
                if (cv.projects.length === 0) return null;
                return (
                    <Section key={id} title={cv.projTitle}>
                        {cv.projects.map(proj => (
                            <div key={proj.id} className="cp-block">
                                <h3 className="cp-block-title">
                                    <span>{proj.name}</span>
                                    {proj.links.map((lnk, i) => (
                                        <PreviewLink key={lnk.id} link={lnk} separator={i === 0 ? "-" : "|"} />
                                    ))}
                                </h3>
                                {proj.description && <p className="cp-block-desc">{proj.description}</p>}
                                {proj.bullets.length > 0 && (
                                    <ul className="cp-ul">
                                        {proj.bullets.map(b => (
                                            <li key={b.id} className="cp-li">{b.text}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </Section>
                );

            case "education":
                if (cv.education.length === 0) return null;
                return (
                    <Section key={id} title={cv.eduTitle}>
                        {cv.education.map(e => (
                            <p key={e.id} className="cp-plain">{e.text}</p>
                        ))}
                    </Section>
                );

            case "languages":
                if (cv.languages.length === 0) return null;
                return (
                    <Section key={id} title={cv.langTitle}>
                        <ul className="cp-ul">
                            {cv.languages.map(l => (
                                <li key={l.id} className="cp-li">{l.text}</li>
                            ))}
                        </ul>
                    </Section>
                );
        }
    };

    return (
        <div
            ref={cvRef}
            className="cv-sheet-preview"
            data-spill={showSpill ? "true" : "false"}
            style={{ "--cv-accent": accentColor, "--cv-d": density } as React.CSSProperties}
        >
            <div ref={contentRef}>
                {/* ── HEADER ── */}
                <header className="cp-header">
                    <div className="cp-header-top">
                        <div>
                            <h1 className="cp-name">{cv.name}</h1>
                            {cv.titleLine && <p className="cp-title">{cv.titleLine}</p>}
                        </div>
                        <div className="cp-contact">
                            {cv.phone && <div>{cv.phone}</div>}
                            {cv.location && <div>{cv.location}</div>}
                            {cv.email && <div>{cv.email}</div>}
                            {cv.links.length > 0 && (
                                <div className="cp-contact-links">
                                    {cv.links.map(lnk => (
                                        <PreviewLink key={lnk.id} link={lnk} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {cv.summary && <p className="cp-summary">{cv.summary}</p>}
                </header>

                {/* ── BODY, in the user's chosen order ── */}
                {cv.sections.filter(s => s.visible).map(s => renderSection(s.id))}
            </div>

            {/* ── Page boundary, preview only ── */}
            {showSpill && (
                <>
                    <div className="cp-spill-tint" data-export-hide="true" aria-hidden />
                    <div className="cp-page-line" data-export-hide="true" aria-hidden style={{ top: SHEET_H }}>
                        <span className="cp-page-line-tag">CUT OFF HERE</span>
                    </div>
                </>
            )}
        </div>
    );
}

/** Injected once at the app root so the sheet CSS isn't rebuilt per render. */
export function CVSheetStyles() {
    return <style dangerouslySetInnerHTML={{ __html: CV_SHEET_CSS }} />;
}
