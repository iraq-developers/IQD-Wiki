"use client"
import { useState, useRef, useEffect, useCallback, useMemo, Suspense, memo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly at dawn.`;

const STORE_KEY = "typecraft_progress";
const STATS_KEY = "typecraft_stats";

async function saveProgress(data: any) {
  try { await (window as any).storage.set(STORE_KEY, JSON.stringify(data)); } catch (e) { }
}
async function loadProgress() {
  try { const r = await (window as any).storage.get(STORE_KEY); return r ? JSON.parse(r.value) : null; } catch (e) { return null; }
}
async function clearProgress() {
  try { await (window as any).storage.delete(STORE_KEY); } catch (e) { }
}
async function saveStats(data: any) {
  try { await (window as any).storage.set(STATS_KEY, JSON.stringify(data)); } catch (e) { }
}
async function loadStats() {
  try { const r = await (window as any).storage.get(STATS_KEY); return r ? JSON.parse(r.value) : null; } catch (e) { return null; }
}

// Reuse a single AudioContext for error sounds
let _audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return _audioCtx;
}

function playErrorSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.11);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.14);
  } catch (e) { }
}

/** Strip markdown syntax and remove any character not directly on a keyboard.
 *  Preserves newlines so the full content structure is shown. */
function cleanText(md: string): string {
  let t = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/^>\s+/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    .replace(/^\|[-:|\s]+\|\s*$/gm, "")
    .replace(/\|/g, " ")
    .replace(/^::youtube\[.*?\]\s*$/gm, "");

  // Only keep printable ASCII (32-126) and newlines — strips emojis, Arabic, accented chars, etc.
  t = t.replace(/[^\x20-\x7E\n]/g, "");

  // Collapse spaces/tabs on each line (but preserve newlines)
  t = t.split("\n").map(line => line.replace(/[ \t]+/g, " ").trim()).join("\n");

  // Collapse 3+ consecutive blank lines into 2
  t = t.replace(/\n{3,}/g, "\n\n");

  return t.trim();
}

// Debounce helper
function useDebouncedCallback<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useCallback((...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);
}

/**
 * Chunked text display — groups consecutive characters with the same status
 * into single <span> elements instead of one <span> per character.
 * Renders the full text so nothing appears or disappears while typing.
 */
const TextDisplay = memo(function TextDisplay({
  activeText,
  typed,
}: {
  activeText: string;
  typed: string;
}) {
  const cursorPos = typed.length;

  // Build chunks for the entire text
  const chunks: { text: string; className: string; hasCursor: boolean }[] = [];

  let currentClass = "";
  let currentText = "";
  let currentHasCursor = false;

  for (let i = 0; i < activeText.length; i++) {
    const ch = activeText[i];
    const isCursor = i === cursorPos;
    let cls: string;

    if (i >= typed.length) {
      // Pending character
      cls = "text-muted-foreground/20";
    } else if (typed[i] === activeText[i]) {
      // Correct
      cls = "text-muted-foreground";
    } else {
      // Error
      if (ch === " " || ch === "\n") {
        cls = "bg-destructive/20 rounded-sm";
      } else {
        cls = "text-destructive bg-destructive/10 rounded-sm";
      }
    }

    // Cursor character always gets its own span
    if (isCursor) {
      // Flush previous chunk
      if (currentText) {
        chunks.push({ text: currentText, className: currentClass, hasCursor: currentHasCursor });
      }
      // For newline at cursor, render a visible marker
      const displayChar = ch === "\n" ? "\u21B5\n" : ch;
      chunks.push({
        text: displayChar,
        className: cls + " typing-cursor relative z-[1]",
        hasCursor: true,
      });
      currentText = "";
      currentClass = "";
      currentHasCursor = false;
      continue;
    }

    if (cls !== currentClass || currentHasCursor) {
      if (currentText) {
        chunks.push({ text: currentText, className: currentClass, hasCursor: currentHasCursor });
      }
      currentText = ch;
      currentClass = cls;
      currentHasCursor = false;
    } else {
      currentText += ch;
    }
  }
  if (currentText) {
    chunks.push({ text: currentText, className: currentClass, hasCursor: currentHasCursor });
  }

  return (
    <>
      {chunks.map((chunk, i) => (
        <span
          key={i}
          className={`whitespace-pre-wrap ${chunk.className}`}
          {...(chunk.hasCursor ? { "data-cursor": "true" } : {})}
        >
          {chunk.text}
        </span>
      ))}
    </>
  );
});

function TypingPracticeInner() {
  const searchParams = useSearchParams();
  const sampleFrom = searchParams.get("sample-from");

  const [sourceText, setSourceText] = useState("");
  const [activeText, setActiveText] = useState("");
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showPaste, setShowPaste] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bestWpm, setBestWpm] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState("");
  const [sampleTitle, setSampleTitle] = useState("");
  const typingRef = useRef<HTMLInputElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const correctCharsRef = useRef(0); // Track correct chars incrementally

  // Load on mount
  useEffect(() => {
    (async () => {
      const stats = await loadStats();
      if (stats) {
        setBestWpm(stats.bestWpm || 0);
        setSessions(stats.sessions || 0);
        if (stats.soundEnabled !== undefined) setSoundEnabled(stats.soundEnabled);
      }
      const prog = await loadProgress();
      if (prog && prog.activeText && prog.typed !== undefined && !prog.isFinished) {
        setActiveText(prog.activeText);
        setSourceText(prog.sourceText || prog.activeText);
        setTyped(prog.typed);
        setErrors(prog.errors || 0);
        setTotalKeystrokes(prog.totalKeystrokes || 0);
        // Recompute correct chars for restored progress
        let cc = 0;
        for (let i = 0; i < prog.typed.length; i++) {
          if (prog.typed[i] === prog.activeText[i]) cc++;
        }
        correctCharsRef.current = cc;
        const t = prog.totalKeystrokes || 0, e = prog.errors || 0;
        setAccuracy(t > 0 ? Math.round(((t - e) / t) * 100) : 100);
        setIsActive(true); setShowPaste(false);
        setTimeout(() => typingRef.current?.focus(), 100);
      }
      setLoaded(true);
    })();
  }, []);

  // Load sample from slug when ?sample-from= is provided
  useEffect(() => {
    if (!sampleFrom || !loaded) return;
    (async () => {
      setSampleLoading(true);
      setSampleError("");
      try {
        const res = await fetch(`/api/raw/${encodeURIComponent(sampleFrom)}`);
        if (!res.ok) {
          setSampleError(`Could not find content "${sampleFrom}"`);
          setSampleLoading(false);
          return;
        }
        const raw = await res.text();
        const plain = cleanText(raw);
        if (!plain) {
          setSampleError("Content is empty after processing");
          setSampleLoading(false);
          return;
        }
        setSampleTitle(sampleFrom.replace(/-/g, " "));
        setSourceText(plain);
        setActiveText(plain);
        setTyped("");
        setIsActive(true);
        startRef.current = null;
        correctCharsRef.current = 0;
        setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
        setIsFinished(false);
        setShowPaste(false);
        setTimeout(() => typingRef.current?.focus(), 100);
      } catch (err) {
        setSampleError("Failed to load content");
      }
      setSampleLoading(false);
    })();
  }, [sampleFrom, loaded]);

  // Debounced save progress — avoids writing on every keystroke
  const debouncedSaveProgress = useDebouncedCallback((data: any) => {
    saveProgress(data);
  }, 1000);

  // Save progress on typed change (debounced)
  useEffect(() => {
    if (!loaded) return;
    if (isActive && activeText) {
      debouncedSaveProgress({ activeText, sourceText, typed, errors, totalKeystrokes, isFinished });
    }
  }, [typed, errors, totalKeystrokes, isFinished, loaded]);

  // Save stats (debounced since soundEnabled toggles)
  const debouncedSaveStats = useDebouncedCallback((data: any) => {
    saveStats(data);
  }, 500);

  useEffect(() => {
    if (!loaded) return;
    debouncedSaveStats({ bestWpm, sessions, soundEnabled });
  }, [bestWpm, sessions, soundEnabled, loaded]);

  // Timer — uses refs to avoid re-render dependency on `typed`
  const typedRef = useRef(typed);
  typedRef.current = typed;
  const isFinishedRef = useRef(isFinished);
  isFinishedRef.current = isFinished;

  useEffect(() => {
    if (!startRef.current || isFinished) return;
    const iv = setInterval(() => {
      if (!startRef.current || isFinishedRef.current) return;
      const now = Date.now();
      const mins = (now - startRef.current) / 60000;
      setElapsed(Math.floor((now - startRef.current) / 1000));
      if (mins > 0) {
        // Use the incrementally tracked correct char count
        setWpm(Math.round(correctCharsRef.current / 5 / mins));
      }
    }, 1000); // Update once per second instead of every 300ms
    return () => clearInterval(iv);
  }, [isFinished, isActive]);

  // Auto-scroll — keep the cursor roughly 1/3 from the top of the container
  useEffect(() => {
    if (!displayRef.current) return;
    const el = displayRef.current.querySelector("[data-cursor]");
    if (el) {
      const box = displayRef.current.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const targetOffset = box.height * 0.33; // keep cursor ~1/3 from top
      if (r.top < box.top + 10 || r.bottom > box.bottom - 30) {
        displayRef.current.scrollTo({
          top: displayRef.current.scrollTop + (r.top - box.top) - targetOffset,
          behavior: "smooth",
        });
      }
    }
  }, [typed]);

  const reset = useCallback(() => {
    setTyped(""); setIsActive(false); startRef.current = null;
    correctCharsRef.current = 0;
    setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
    setIsFinished(false); setShowPaste(true); setActiveText("");
    setSampleTitle("");
    clearProgress();
  }, []);

  const restart = useCallback(() => {
    setTyped(""); startRef.current = null;
    correctCharsRef.current = 0;
    setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
    setIsFinished(false);
    setTimeout(() => typingRef.current?.focus(), 50);
  }, []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (isFinished) return;
    if (e.key === "Tab") { e.preventDefault(); restart(); return; }
    if (e.key === "Escape") { e.preventDefault(); reset(); return; }
    if (e.key === "Backspace") {
      e.preventDefault();
      setTyped(p => {
        if (p.length === 0) return p;
        // Adjust correct char count if the removed char was correct
        if (p[p.length - 1] === activeText[p.length - 1]) {
          correctCharsRef.current--;
        }
        return p.slice(0, -1);
      });
      return;
    }

    // Handle Enter key — treat as typing a newline character
    let typedChar: string;
    if (e.key === "Enter") {
      e.preventDefault();
      typedChar = "\n";
    } else if (e.key.length !== 1) {
      return;
    } else {
      e.preventDefault();
      typedChar = e.key;
    }

    if (!startRef.current) startRef.current = Date.now();

    setTyped(prev => {
      const expected = activeText[prev.length];
      const ok = typedChar === expected;

      // Update correct char count incrementally
      if (ok) correctCharsRef.current++;

      const nt = totalKeystrokes + 1;
      setTotalKeystrokes(nt);
      const ne = ok ? errors : errors + 1;
      if (!ok) { setErrors(ne); if (soundEnabled) playErrorSound(); }
      setAccuracy(Math.round(((nt - ne) / nt) * 100));

      const newTyped = prev + typedChar;
      if (newTyped.length >= activeText.length) {
        setIsFinished(true);
        const mins = (Date.now() - startRef.current!) / 60000;
        const fw = Math.round(correctCharsRef.current / 5 / mins);
        setWpm(fw); setSessions(p => p + 1);
        setBestWpm(b => fw > b ? fw : b);
      }
      return newTyped;
    });
  }, [isFinished, activeText, errors, totalKeystrokes, soundEnabled, restart, reset]);

  const fmt = useCallback((s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`, []);
  const pct = activeText.length > 0 ? (typed.length / activeText.length) * 100 : 0;

  const handleStartPractice = useCallback(() => {
    const t = cleanText(sourceText.trim() || SAMPLE_TEXT);
    setSourceText(t); setActiveText(t); setTyped("");
    setIsActive(true); startRef.current = null;
    correctCharsRef.current = 0;
    setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
    setIsFinished(false); setShowPaste(false);
    setSampleTitle("");
    setTimeout(() => typingRef.current?.focus(), 50);
  }, [sourceText]);

  if (!loaded) return (
    <div dir="ltr" className="h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-base">
      loading...
    </div>
  );

  if (sampleLoading) return (
    <div dir="ltr" className="h-screen bg-background flex flex-col items-center justify-center gap-3 text-muted-foreground font-mono text-base">
      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      <span>Loading content from &quot;{sampleFrom}&quot;...</span>
    </div>
  );

  return (
    <>
      {/* Minimal style for cursor blink + custom animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        .typing-cursor::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2.5px;
          background: #5ea500;
          border-radius: 2px;
          z-index: 2;
          animation: cursor-blink 1s step-end infinite;
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1 }
          50% { opacity: 0 }
        }
        @keyframes hint-pulse {
          0%, 100% { opacity: 0.5 }
          50% { opacity: 0.2 }
        }
        @keyframes finish-in {
          from { opacity: 0; transform: scale(0.97) }
          to { opacity: 1; transform: scale(1) }
        }
      `}</style>

      <div dir="ltr" className="h-screen bg-background text-foreground font-[Outfit,sans-serif] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2.5 select-none no-underline hover:opacity-80 transition-opacity">
              <Image src="/logo.webp" alt="IQD Wiki" width={32} height={32} className="rounded-md" />
              <span className="font-mono text-lg font-bold tracking-tight text-primary">
                IqdWiki<span className="text-muted-foreground/40">.com</span>
              </span>
            </Link>
            {sampleTitle && (
              <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full font-mono">
                {sampleTitle}
              </div>
            )}
            <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground/30 bg-secondary/50 px-2 py-0.5 rounded font-mono font-medium border border-border/50">
              English only
            </div>
            <div className="flex gap-4 font-mono text-xs text-muted-foreground/40">
              <span>best <span className="text-muted-foreground">{bestWpm}wpm</span></span>
              <span>sessions <span className="text-muted-foreground">{sessions}</span></span>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <ModeToggle />
            <button
              className={`border rounded-lg w-9 h-9 flex items-center justify-center text-base cursor-pointer transition-all duration-150
                ${soundEnabled
                  ? "text-primary border-primary/20"
                  : "text-muted-foreground/40 border-border"
                } hover:bg-accent`}
              onClick={() => setSoundEnabled(p => !p)}
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? "♪" : "✕"}
            </button>
            {isActive && <>
              <button className="bg-secondary border border-border text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-mono cursor-pointer transition-all duration-150 hover:bg-accent hover:text-primary" onClick={restart}>restart</button>
              <button className="bg-secondary border border-border text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-mono cursor-pointer transition-all duration-150 hover:bg-accent hover:text-primary" onClick={reset}>new text</button>
            </>}
          </div>
        </div>

        {/* Stats bar */}
        {isActive && <div className="flex gap-0 px-8 shrink-0 border-b border-border">
          <div className="py-3.5 px-6 flex items-baseline gap-2 border-r border-border">
            <div className="font-mono text-2xl font-bold text-primary leading-none">{wpm}</div>
            <div className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">wpm</div>
          </div>
          <div className="py-3.5 px-6 flex items-baseline gap-2 border-r border-border">
            <div className="font-mono text-2xl font-bold text-primary leading-none">{accuracy}%</div>
            <div className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">acc</div>
          </div>
          <div className="py-3.5 px-6 flex items-baseline gap-2 border-r border-border">
            <div className="font-mono text-2xl font-bold text-primary leading-none">{errors}</div>
            <div className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">err</div>
          </div>
          <div className="py-3.5 px-6 flex items-baseline gap-2 border-r border-border">
            <div className="font-mono text-2xl font-bold text-primary leading-none">{fmt(elapsed)}</div>
            <div className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">time</div>
          </div>
          <div className="py-3.5 px-6 flex items-baseline gap-2">
            <div className="font-mono text-2xl font-bold text-primary leading-none">
              {typed.length}<span className="text-muted-foreground/40 font-normal">/{activeText.length}</span>
            </div>
            <div className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">chars</div>
          </div>
        </div>}

        {/* Progress bar */}
        {isActive && <div className="h-1 bg-border/50 shrink-0">
          <div className="h-full bg-primary transition-[width] duration-100 rounded-r-sm" style={{ width: `${pct}%` }} />
        </div>}

        {/* Main workspace */}
        <div className="flex-1 flex min-h-0">
          {/* Typing area */}
          <div className="flex-1 p-8 px-10 flex flex-col relative cursor-text min-h-0" onClick={() => typingRef.current?.focus()}>
            {isActive ? <>
              <div className="text-xs uppercase tracking-[2.5px] text-muted-foreground/25 mb-4 font-semibold shrink-0 transition-colors duration-200">
                {startRef.current ? "typing..." : "start typing"}
              </div>
              <div
                ref={displayRef}
                className="text-4xl leading-[2.2] tracking-wide flex-1 overflow-y-auto"
                style={{ scrollbarWidth: "none", fontFamily: "'Source Code Pro', monospace" }}
              >
                <TextDisplay activeText={activeText} typed={typed} />
              </div>
              <input ref={typingRef} className="absolute opacity-0 w-0 h-0 pointer-events-none" onKeyDown={onKey} autoFocus tabIndex={0} />
              {!startRef.current && !isFinished && (
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-muted-foreground/25 font-mono pointer-events-none"
                  style={{ animation: "hint-pulse 2s ease-in-out infinite" }}
                >
                  click here · start typing
                </div>
              )}

              {/* Finished overlay */}
              {isFinished && (
                <div
                  className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 z-10"
                  style={{ animation: "finish-in 0.3s ease" }}
                >
                  <div className="text-xs uppercase tracking-[3px] text-primary font-bold bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                    completed
                  </div>
                  <div className="flex gap-12">
                    <div className="text-center">
                      <div className="font-mono text-5xl font-bold text-foreground">{wpm}</div>
                      <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold mt-1">wpm</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-5xl font-bold text-foreground">{accuracy}%</div>
                      <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold mt-1">accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-5xl font-bold text-foreground">{errors}</div>
                      <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold mt-1">errors</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-5xl font-bold text-foreground">{fmt(elapsed)}</div>
                      <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold mt-1">time</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button className="px-6 py-3 rounded-lg font-[Outfit,sans-serif] text-sm font-medium cursor-pointer transition-all duration-150 bg-primary text-primary-foreground hover:opacity-90" onClick={restart}>try again</button>
                    <button className="px-6 py-3 rounded-lg font-[Outfit,sans-serif] text-sm font-medium cursor-pointer transition-all duration-150 bg-transparent text-muted-foreground border border-border hover:bg-accent hover:text-primary" onClick={reset}>new text</button>
                  </div>
                </div>
              )}
            </> : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-12">
                <div className="text-5xl opacity-10 mb-2" style={{ fontFamily: "'Source Code Pro', monospace" }}>_</div>
                <h2 className="text-xl font-medium text-muted-foreground">Ready to practice?</h2>
                <p className="text-muted-foreground/60 text-base text-center max-w-[360px] leading-relaxed">
                  Paste any English text on the right panel — articles, paragraphs, notes — and start typing to practice.
                </p>
                <div className="text-xs text-muted-foreground/30 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50 font-mono uppercase tracking-widest">
                  English text only · Arabic will be auto-removed
                </div>
                {sampleError && (
                  <div className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-lg mt-2">
                    {sampleError}
                  </div>
                )}
                <div className="mt-6 text-sm text-muted-foreground/40 font-mono text-center leading-relaxed">
                  <span className="text-muted-foreground/60 font-semibold">Tip:</span> You can also load content from IqdWiki articles by adding<br />
                  <code className="bg-secondary px-2 py-1 rounded text-primary text-xs">?sample-from=article-slug</code> to the URL
                </div>
              </div>
            )}
          </div>

          {/* Paste panel */}
          {showPaste && (
            <div className="w-[380px] shrink-0 flex flex-col border-l border-border bg-card/50">
              <div className="px-5 py-4 border-b border-border">
                <div className="text-xs uppercase tracking-[2.5px] text-muted-foreground/40 font-semibold">Paste your text</div>
              </div>
              <div className="flex-1 p-5 min-h-0">
                <textarea
                  className="w-full h-full bg-transparent border-none text-muted-foreground font-mono text-sm leading-[1.8] resize-none outline-none placeholder:text-muted-foreground/20"
                  style={{ scrollbarWidth: "none" }}
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  placeholder={"Paste English text here...\n\narticle, paragraph, notes,\nor any text you want to\npractice typing.\n\nArabic text will be\nautomatically removed.\n\nProgress saves automatically."}
                  spellCheck={false}
                />
              </div>
              <div className="p-5 border-t border-border">
                <button
                  className="w-full bg-primary text-primary-foreground border-none py-3 rounded-xl font-[Outfit,sans-serif] text-base font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-primary/10"
                  onClick={handleStartPractice}
                >
                  {sourceText.trim() ? "start practice →" : "use sample text →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts footer */}
        <div className="flex gap-4 justify-center py-2.5 shrink-0 border-t border-border">
          <span className="font-mono text-[11px] text-muted-foreground/25">
            <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground/50 text-[11px] mr-1">tab</kbd> restart
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/25">
            <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground/50 text-[11px] mr-1">esc</kbd> new text
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/25">
            <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground/50 text-[11px] mr-1">bksp</kbd> fix errors
          </span>
        </div>
      </div>
    </>
  );
}

export default function TypingPractice() {
  return (
    <Suspense fallback={
      <div dir="ltr" className="h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-base">
        loading...
      </div>
    }>
      <TypingPracticeInner />
    </Suspense>
  );
}
