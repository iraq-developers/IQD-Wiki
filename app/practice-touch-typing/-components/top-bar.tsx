"use client";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function TopBar({
    title,
    sound,
    onToggleSound,
    onRestart,
    onLeave,
}: {
    title?: string;
    sound: boolean;
    onToggleSound: () => void;
    onRestart?: () => void;
    onLeave?: () => void;
}) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
            {onLeave ? (
                <Button variant="ghost" size="sm" onClick={onLeave} className="text-muted-foreground">
                    <ArrowLeft className="size-3.5" />
                    <span className="hidden sm:inline">library</span>
                </Button>
            ) : (
                <Link
                    href="/"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    ← iqdwiki
                </Link>
            )}

            {title && (
                <span className="truncate text-sm text-muted-foreground/60">{title}</span>
            )}

            <div className="ms-auto flex items-center gap-1 sm:gap-2">
                {onRestart && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRestart}
                        className="text-muted-foreground"
                    >
                        <RotateCcw className="size-3.5" />
                        <span className="hidden sm:inline">restart</span>
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onToggleSound}
                    aria-pressed={sound}
                    aria-label={sound ? "turn keyboard sound off" : "turn keyboard sound on"}
                    className={sound ? "text-foreground" : "text-muted-foreground/50"}
                >
                    {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                </Button>
                <div dir="rtl">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
