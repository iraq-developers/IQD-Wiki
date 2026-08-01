"use client";

import React from "react";
import { TreeView, type TreeDataItem } from "@/components/tree-view";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { buildTreeData, EditorRouter } from "../editors/editor-router";
import type { EditorCtx } from "../editors/shared";
import type { CVBuilder } from "../hooks/use-cv-builder";
import { AIBuilderDialog } from "../ai/ai-dialog";
import { ColorPicker } from "../color-picker";
import { SaveIndicator, UndoRedo, ExportMenu, SettingsMenu } from "./toolbar";

/* ══════════════════════════════════════════════════════
   EDITOR PANEL — desktop / tablet
   Tree navigation on the left, the selected editor on
   the right, both inside a resizable split.
══════════════════════════════════════════════════════ */

export function EditorPanel({
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
    const { cv, t, prefs, setAccentColor, replaceCV } = builder;
    const treeData = buildTreeData(cv, t);

    const handleSelect = (item: TreeDataItem | undefined) => {
        if (item) onSelect(item.id);
    };

    return (
        <div className="flex h-full min-h-0 flex-col border-s bg-background">

            {/* ── Header ── */}
            <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-b px-3 py-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight">{t("appTitle")}</p>
                    <SaveIndicator builder={builder} />
                </div>

                <div className="ms-auto flex items-center gap-1.5">
                    <UndoRedo builder={builder} />
                    <ColorPicker accentColor={prefs.accentColor} onChange={setAccentColor} t={t} />
                    <SettingsMenu builder={builder} />
                    <AIBuilderDialog cv={cv} replaceCV={replaceCV} t={t} uiLang={prefs.uiLang} />
                    <ExportMenu builder={builder} />
                </div>
            </div>

            {/* ── Body ── */}
            <div className="min-h-0 flex-1">
                <ResizablePanelGroup orientation="horizontal" className="h-full">
                    <ResizablePanel defaultSize="32%" minSize="20%" maxSize="50%">
                        <div className="flex h-full min-h-0 flex-col border-e bg-muted/20">
                            <p className="shrink-0 px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                {t("sections")}
                            </p>
                            <ScrollArea className="min-h-0 flex-1">
                                <TreeView
                                    data={treeData}
                                    selectedItemId={selectedId}
                                    initialSelectedItemId={selectedId}
                                    onSelectChange={handleSelect}
                                    expandAll
                                    className="text-sm"
                                />
                            </ScrollArea>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize="68%" minSize="45%">
                        <ScrollArea className="h-full">
                            <div className="p-4 pb-16">
                                <EditorRouter selectedId={selectedId} ctx={ctx} />
                            </div>
                        </ScrollArea>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
