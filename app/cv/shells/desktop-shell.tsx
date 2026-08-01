"use client";

import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { PreviewStage } from "../preview/preview-stage";
import { EditorPanel } from "./editor-panel";
import type { EditorCtx } from "../editors/shared";
import type { CVBuilder } from "../hooks/use-cv-builder";

/* ══════════════════════════════════════════════════════
   DESKTOP / TABLET SHELL — the familiar split view.

   Sizes are percentage strings on purpose: in
   react-resizable-panels v4 a bare number means *pixels*.
══════════════════════════════════════════════════════ */

export function DesktopShell({
    builder,
    ctx,
    selectedId,
    onSelect,
}: {
    builder: CVBuilder;
    ctx: EditorCtx;
    selectedId: string;
    onSelect: (id: string) => void;
}) {
    return (
        <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize="60%" minSize="30%">
                <PreviewStage builder={builder} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="40%" minSize="26%">
                <EditorPanel builder={builder} ctx={ctx} selectedId={selectedId} onSelect={onSelect} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
