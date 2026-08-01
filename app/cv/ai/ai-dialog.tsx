"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Sparkles, Copy, Check, ExternalLink, ChevronDown, WandSparkles,
    FileText, Target, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ResponsiveDialog } from "./responsive-dialog";
import { ReviewChanges } from "./review-changes";
import { buildPrompt, PROVIDERS, type AIMode } from "./prompts";
import { extractCVJson, PASTE_ERROR_KEY } from "./smart-paste";
import { normalizeCV, mergeCV } from "../cv-schema";
import type { CVData } from "../types";
import type { TFunc, UILang } from "../i18n";

/* ══════════════════════════════════════════════════════
   AI CV BUILDER

   Copy a prompt → chat anywhere → paste the reply back.
   No API key, no server, no cost — and it survives
   whatever shape the model's answer arrives in.
══════════════════════════════════════════════════════ */

interface Props {
    cv: CVData;
    replaceCV: (cv: CVData) => void;
    t: TFunc;
    uiLang: UILang;
    trigger?: React.ReactNode;
}

const MODE_META: Record<AIMode, {
    icon: React.ComponentType<{ className?: string }>;
    title: "aiModeBuild" | "aiModeConvert" | "aiModeTailor";
    hint: "aiModeBuildHint" | "aiModeConvertHint" | "aiModeTailorHint";
}> = {
    build: { icon: WandSparkles, title: "aiModeBuild", hint: "aiModeBuildHint" },
    convert: { icon: FileText, title: "aiModeConvert", hint: "aiModeConvertHint" },
    tailor: { icon: Target, title: "aiModeTailor", hint: "aiModeTailorHint" },
};

export function AIBuilderDialog({ cv, replaceCV, t, uiLang, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<AIMode>("build");
    const [promptLang, setPromptLang] = useState<UILang>(uiLang);
    const [jobPost, setJobPost] = useState("");
    const [oldCV, setOldCV] = useState("");
    const [pasted, setPasted] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    /* When a paste parses successfully we switch to the review stage. */
    const [pending, setPending] = useState<{ cv: CVData; warnings: string[] } | null>(null);

    const prompt = useMemo(
        () => buildPrompt({ mode, lang: promptLang, cv, jobPost, oldCV }),
        [mode, promptLang, cv, jobPost, oldCV]
    );

    const copyPrompt = async (): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch {
            toast.error(t("exportFailed"), { description: "Clipboard unavailable — select the prompt and copy it manually." });
            return false;
        }
    };

    const openProvider = async (url: string) => {
        const ok = await copyPrompt();
        if (ok) toast.success(t("aiCopiedToast"));
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleReview = () => {
        setBusy(true);
        setError(null);
        try {
            const result = extractCVJson(pasted);
            if (!result.ok) {
                setError(t(PASTE_ERROR_KEY[result.code]));
                return;
            }
            // Normalising here means nothing downstream can ever see a
            // malformed CV — missing arrays, string bullets, stray ids and all.
            const { cv: incoming, warnings } = normalizeCV(result.value);
            setPending({ cv: incoming, warnings });
        } finally {
            setBusy(false);
        }
    };

    const finish = (next: CVData) => {
        replaceCV(next);
        setPending(null);
        setPasted("");
        setError(null);
        setOpen(false);
        toast.success(t("reviewApplied"));
    };

    const reset = () => {
        setPending(null);
        setError(null);
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={next => { setOpen(next); if (!next) reset(); }}
            trigger={trigger ?? (
                <Button size="sm">
                    <Sparkles className="size-3.5" /> {t("aiBuilder")}
                </Button>
            )}
            title={t("aiTitle")}
            description={pending ? undefined : t("aiSubtitle")}
        >
            {pending ? (
                <ReviewChanges
                    current={cv}
                    incoming={pending.cv}
                    warnings={pending.warnings}
                    t={t}
                    onReplace={() => finish(pending.cv)}
                    onMerge={() => finish(mergeCV(cv, pending.cv))}
                    onCancel={reset}
                />
            ) : (
                <div className="space-y-5 pb-1">

                    {/* ── 1 · Mode ── */}
                    <Step n={1} title={t("aiStep1")}>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {(Object.keys(MODE_META) as AIMode[]).map(m => {
                                const meta = MODE_META[m];
                                const Icon = meta.icon;
                                const active = mode === m;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMode(m)}
                                        aria-pressed={active}
                                        className={cn(
                                            "rounded-lg border p-2.5 text-start transition-colors",
                                            active ? "border-primary/50 bg-primary/10" : "hover:bg-muted"
                                        )}
                                    >
                                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                                            <Icon className="size-3.5 shrink-0" />
                                            {t(meta.title)}
                                        </span>
                                        <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                                            {t(meta.hint)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {mode === "tailor" && (
                            <div className="mt-3 space-y-1.5">
                                <label className="text-xs font-medium" htmlFor="ai-jobpost">{t("aiJobPostLabel")}</label>
                                <Textarea
                                    id="ai-jobpost"
                                    value={jobPost}
                                    onChange={e => setJobPost(e.target.value)}
                                    rows={4}
                                    className="resize-y text-base sm:text-sm"
                                    placeholder={t("aiJobPostPlaceholder")}
                                />
                            </div>
                        )}

                        {mode === "convert" && (
                            <div className="mt-3 space-y-1.5">
                                <label className="text-xs font-medium" htmlFor="ai-oldcv">{t("aiOldCvLabel")}</label>
                                <Textarea
                                    id="ai-oldcv"
                                    value={oldCV}
                                    onChange={e => setOldCV(e.target.value)}
                                    rows={4}
                                    className="resize-y text-base sm:text-sm"
                                    placeholder={t("aiOldCvPlaceholder")}
                                />
                            </div>
                        )}
                    </Step>

                    {/* ── 2 · Copy + open ── */}
                    <Step n={2} title={t("aiStep2")}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-muted-foreground">{t("aiPromptLang")}</span>
                            <Tabs value={promptLang} onValueChange={v => setPromptLang(v as UILang)}>
                                <TabsList className="h-7">
                                    <TabsTrigger value="en" className="text-[11px]">English</TabsTrigger>
                                    <TabsTrigger value="ar" className="text-[11px]">العربية</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {PROVIDERS.map(p => (
                                <Button
                                    key={p.id}
                                    variant="outline"
                                    size="sm"
                                    className="justify-center"
                                    onClick={() => openProvider(p.url)}
                                >
                                    {p.name}
                                    <ExternalLink className="size-3" />
                                </Button>
                            ))}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <Button variant="secondary" size="sm" className="flex-1" onClick={async () => {
                                if (await copyPrompt()) toast.success(t("aiCopiedToast"));
                            }}>
                                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                                {copied ? t("aiCopied") : t("aiCopyPrompt")}
                            </Button>
                        </div>

                        <Collapsible className="mt-2">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="xs" className="text-muted-foreground">
                                    <ChevronDown className="size-3 transition-transform data-[state=open]:rotate-180" />
                                    {prompt.length.toLocaleString()} characters
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <pre className="mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                                    {prompt}
                                </pre>
                            </CollapsibleContent>
                        </Collapsible>
                    </Step>

                    {/* ── 3 · Paste back ── */}
                    <Step n={3} title={t("aiStep3")}>
                        <Textarea
                            value={pasted}
                            onChange={e => { setPasted(e.target.value); setError(null); }}
                            rows={5}
                            className="resize-y font-mono text-base sm:text-xs"
                            placeholder={t("aiPastePlaceholder")}
                            aria-label={t("aiPasteLabel")}
                            spellCheck={false}
                        />
                        {error && (
                            <p className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2 text-xs text-destructive">
                                {error}
                            </p>
                        )}
                        <Button
                            className="mt-2 w-full"
                            disabled={!pasted.trim() || busy}
                            onClick={handleReview}
                        >
                            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                            {t("aiApply")}
                        </Button>
                    </Step>
                </div>
            )}
        </ResponsiveDialog>
    );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
    return (
        <section>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                    {n}
                </span>
                {title}
            </h4>
            {children}
        </section>
    );
}
