"use client";
import { Suspense } from "react";
import { useTyping } from "./-components/use-typing";
import TypingStyles from "./-components/typing-styles";
import TopBar from "./-components/top-bar";
import Library from "./-components/library";
import TextView from "./-components/text-view";
import FinishView from "./-components/finish-view";

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div
            dir="ltr"
            className="flex min-h-[100dvh] flex-col bg-background text-foreground"
        >
            {children}
        </div>
    );
}

function Practice() {
    const t = useTyping();

    if (!t.ready || t.slugState === "loading") {
        return <Shell>{null}</Shell>;
    }

    if (!t.piece) {
        return (
            <Shell>
                <TopBar sound={t.sound} onToggleSound={t.toggleSound} />
                {t.slugState === "error" && (
                    <p className="mx-auto w-full max-w-5xl px-5 text-sm text-destructive sm:px-8">
                        couldn&apos;t load “{t.slug}” — pick something below instead.
                    </p>
                )}
                <Library completed={t.completed} resume={t.resume} onStart={t.start} />
            </Shell>
        );
    }

    return (
        <Shell>
            <TopBar
                title={t.piece.title}
                sound={t.sound}
                onToggleSound={t.toggleSound}
                onRestart={t.again}
                onLeave={t.leave}
            />

            <main className="flex flex-1 flex-col justify-center px-5 sm:px-10">
                <div className="typing-surface mx-auto w-full max-w-5xl">
                    <TextView text={t.piece.text} typed={t.typed} hideCursor={t.done} />
                </div>

                {t.done ? (
                    <div className="mx-auto w-full max-w-5xl">
                        <FinishView onAgain={t.again} onNext={t.next} onLeave={t.leave} />
                    </div>
                ) : (
                    <p className="mx-auto mt-8 hidden gap-5 text-xs text-muted-foreground/40 sm:flex">
                        <span>
                            <kbd className="font-mono">tab</kbd> restart
                        </span>
                        <span>
                            <kbd className="font-mono">esc</kbd> library
                        </span>
                        <span>
                            <kbd className="font-mono">ctrl</kbd>+<kbd className="font-mono">enter</kbd>{" "}
                            skip line
                        </span>
                    </p>
                )}

                <p className="mt-8 text-center text-xs text-muted-foreground/50 sm:hidden">
                    this one needs a real keyboard.
                </p>
            </main>
        </Shell>
    );
}

export default function PracticeTouchTypingPage() {
    return (
        <>
            <TypingStyles />
            <Suspense fallback={<Shell>{null}</Shell>}>
                <Practice />
            </Suspense>
        </>
    );
}
