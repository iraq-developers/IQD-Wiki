"use client";

import React, { useState } from "react";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { TFunc } from "./i18n";

/* ══════════════════════════════════════════════════════
   ACCENT COLOUR PICKER

   Lives in the toolbar rather than floating over the page,
   so it can never cover content on a small screen.
══════════════════════════════════════════════════════ */

export const ACCENT_PRESETS = [
    { name: "Classic Navy", hex: "#1e40af" },
    { name: "Charcoal", hex: "#334155" },
    { name: "Forest", hex: "#115e59" },
    { name: "Burgundy", hex: "#7f1d1d" },
    { name: "Plum", hex: "#581c87" },
    { name: "Bronze", hex: "#9a3412" },
    { name: "Deep Teal", hex: "#0f766e" },
    { name: "Jet Black", hex: "#0f172a" },
] as const;

const HEX_RE = /^#[0-9a-f]{6}$/i;

export function ColorPicker({
    accentColor,
    onChange,
    t,
    className,
}: {
    accentColor: string;
    onChange: (hex: string) => void;
    t: TFunc;
    className?: string;
}) {
    const [draft, setDraft] = useState(accentColor);

    const commitDraft = (value: string) => {
        setDraft(value);
        const withHash = value.startsWith("#") ? value : `#${value}`;
        if (HEX_RE.test(withHash)) onChange(withHash.toLowerCase());
    };

    return (
        <Popover onOpenChange={open => open && setDraft(accentColor)}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon-sm"
                    className={cn("relative", className)}
                    aria-label={t("themeColor")}
                    title={t("themeColor")}
                >
                    <Palette className="size-3.5" />
                    <span
                        className="absolute inset-x-1 bottom-0.5 h-1 rounded-full"
                        style={{ background: accentColor }}
                        aria-hidden
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto">
                <p className="text-xs font-medium">{t("themeColor")}</p>

                <div className="grid grid-cols-4 gap-1.5">
                    {ACCENT_PRESETS.map(({ name, hex }) => {
                        const active = accentColor.toLowerCase() === hex.toLowerCase();
                        return (
                            <button
                                key={hex}
                                type="button"
                                title={name}
                                aria-label={name}
                                aria-pressed={active}
                                onClick={() => { onChange(hex); setDraft(hex); }}
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-full ring-offset-2 ring-offset-popover transition-transform",
                                    "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    active && "ring-2 ring-foreground"
                                )}
                                style={{ background: hex }}
                            >
                                {active && <Check className="size-4 text-white" strokeWidth={3} />}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 border-t pt-2.5">
                    <label className="sr-only" htmlFor="cv-accent-native">{t("customColor")}</label>
                    <input
                        id="cv-accent-native"
                        type="color"
                        value={HEX_RE.test(draft) ? draft : accentColor}
                        onChange={e => commitDraft(e.target.value)}
                        className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent p-0.5"
                        aria-label={t("customColor")}
                    />
                    <Input
                        value={draft}
                        onChange={e => commitDraft(e.target.value)}
                        className="h-9 w-28 font-mono text-sm uppercase"
                        placeholder="#1E40AF"
                        aria-label={t("customColor")}
                        spellCheck={false}
                        autoCapitalize="off"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
