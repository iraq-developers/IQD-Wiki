"use client";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Quiet by design: you finished, that's the whole result. */
export default function FinishView({
    onAgain,
    onNext,
    onLeave,
}: {
    onAgain: () => void;
    onNext: () => void;
    onLeave: () => void;
}) {
    return (
        <div className="typing-rise flex flex-col items-center gap-5 py-10 text-center">
            <div>
                <p className="text-2xl font-medium">done.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    that&apos;s the whole text. keep the momentum going.
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
                <Button size="lg" onClick={onNext}>
                    next text
                    <ArrowRight className="size-3.5" />
                </Button>
                <Button size="lg" variant="outline" onClick={onAgain}>
                    <RotateCcw className="size-3.5" />
                    type it again
                </Button>
                <Button size="lg" variant="ghost" onClick={onLeave} className="text-muted-foreground">
                    library
                </Button>
            </div>
        </div>
    );
}
