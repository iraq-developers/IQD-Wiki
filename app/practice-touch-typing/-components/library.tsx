"use client";
import { Check, Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SAMPLES, randomSample, sizeOf, type Sample } from "./samples";

const SIZE_LABEL = { short: "short", medium: "medium", long: "long" } as const;

export default function Library({
    completed,
    resume,
    onStart,
}: {
    completed: string[];
    resume: { id: string; at: number } | null;
    onStart: (sample: Sample, at?: number) => void;
}) {
    const resumeSample = resume ? SAMPLES.find((s) => s.id === resume.id) : undefined;

    return (
        <div className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
            <div className="typing-rise py-10 sm:py-16">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">just type.</h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Pick something worth reading and start typing. No score, no timer, no test —
                    just you, the words, and the keyboard.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Button size="lg" onClick={() => onStart(randomSample())}>
                        <Shuffle className="size-3.5" />
                        surprise me
                    </Button>
                    {resumeSample && (
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => onStart(resumeSample, resume!.at)}
                        >
                            <Play className="size-3.5" />
                            continue {resumeSample.title.toLowerCase()}
                        </Button>
                    )}
                </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SAMPLES.map((sample, i) => {
                    const isDone = completed.includes(sample.id);
                    return (
                        <li
                            key={sample.id}
                            className="typing-rise"
                            style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
                        >
                            <button
                                type="button"
                                onClick={() => onStart(sample)}
                                className={cn(
                                    "group flex h-full w-full flex-col items-start gap-2 rounded-xl border border-border/70 bg-card p-4 text-start",
                                    "transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/40",
                                    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                                )}
                            >
                                <div className="flex w-full items-center gap-2">
                                    <span className="font-medium">{sample.title}</span>
                                    {isDone && (
                                        <Check
                                            className="ms-auto size-3.5 shrink-0 text-primary"
                                            aria-label="typed before"
                                        />
                                    )}
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {sample.hook}
                                </p>
                                <span className="mt-auto pt-2 text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground/50">
                                    {SIZE_LABEL[sizeOf(sample)]}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <p className="mt-10 text-center text-xs text-muted-foreground/50">
                tip: add <code className="rounded bg-muted px-1.5 py-0.5">?sample-from=slug</code>{" "}
                to the URL to type any iqdwiki article
            </p>
        </div>
    );
}
