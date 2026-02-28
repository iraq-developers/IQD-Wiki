"use client"
import { useState, useRef, useEffect } from "react";
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

function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.11);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.14);
    setTimeout(() => ctx.close(), 250);
  } catch (e) { }
}

export default function TypingPractice() {
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
  const typingRef = useRef<HTMLInputElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);

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
        const t = prog.totalKeystrokes || 0, e = prog.errors || 0;
        setAccuracy(t > 0 ? Math.round(((t - e) / t) * 100) : 100);
        setIsActive(true); setShowPaste(false);
        setTimeout(() => typingRef.current?.focus(), 100);
      }
      setLoaded(true);
    })();
  }, []);

  // Save progress on typed change
  useEffect(() => {
    if (!loaded) return;
    if (isActive && activeText) {
      saveProgress({ activeText, sourceText, typed, errors, totalKeystrokes, isFinished });
    }
  }, [typed, errors, totalKeystrokes, isFinished, loaded]);

  // Save stats
  useEffect(() => {
    if (!loaded) return;
    saveStats({ bestWpm, sessions, soundEnabled });
  }, [bestWpm, sessions, soundEnabled, loaded]);

  // Timer
  useEffect(() => {
    if (!startRef.current || isFinished) return;
    const iv = setInterval(() => {
      const now = Date.now();
      const mins = (now - startRef.current!) / 60000;
      setElapsed(Math.floor((now - startRef.current!) / 1000));
      if (mins > 0) {
        const cc = typed.split("").filter((c, i) => c === activeText[i]).length;
        setWpm(Math.round(cc / 5 / mins));
      }
    }, 300);
    return () => clearInterval(iv);
  }, [startRef.current, typed, activeText, isFinished]);

  // Auto-scroll
  useEffect(() => {
    if (!displayRef.current) return;
    const el = displayRef.current.querySelector(".cur");
    if (el) {
      const box = displayRef.current.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.top < box.top + 5 || r.bottom > box.bottom - 15) {
        displayRef.current.scrollTo({ top: displayRef.current.scrollTop + (r.top - box.top) - 48, behavior: "smooth" });
      }
    }
  }, [typed]);

  const reset = () => {
    setTyped(""); setIsActive(false); startRef.current = null;
    setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
    setIsFinished(false); setShowPaste(true); setActiveText("");
    clearProgress();
  };

  const restart = () => {
    setTyped(""); startRef.current = null;
    setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
    setIsFinished(false);
    setTimeout(() => typingRef.current?.focus(), 50);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (isFinished) return;
    if (e.key === "Tab") { e.preventDefault(); restart(); return; }
    if (e.key === "Escape") { e.preventDefault(); reset(); return; }
    if (e.key === "Backspace") { e.preventDefault(); if (typed.length > 0) setTyped(p => p.slice(0, -1)); return; }
    if (e.key.length !== 1) return;
    e.preventDefault();
    if (!startRef.current) startRef.current = Date.now();

    const expected = activeText[typed.length];
    const ok = e.key === expected;
    const nt = totalKeystrokes + 1;
    setTotalKeystrokes(nt);
    const ne = ok ? errors : errors + 1;
    if (!ok) { setErrors(ne); if (soundEnabled) playErrorSound(); }
    setAccuracy(Math.round(((nt - ne) / nt) * 100));
    const newTyped = typed + e.key;
    setTyped(newTyped);

    if (newTyped.length >= activeText.length) {
      setIsFinished(true);
      const mins = (Date.now() - startRef.current) / 60000;
      const cc = newTyped.split("").filter((c, i) => c === activeText[i]).length;
      const fw = Math.round(cc / 5 / mins);
      setWpm(fw); setSessions(p => p + 1);
      if (fw > bestWpm) setBestWpm(fw);
    }
  };

  const status = (i: number) => {
    if (i >= typed.length) return "p";
    return typed[i] === activeText[i] ? "ok" : "err";
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const pct = activeText.length > 0 ? (typed.length / activeText.length) * 100 : 0;

  if (!loaded) return (
    <div dir="ltr" className="h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">
      loading...
    </div>
  );

  return (
    <>
      {/* Cursor blink animation + font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        .cur-char::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: hsl(var(--primary) / 0.75);
          border-radius: 2px;
          z-index: -1;
          animation: cursor-blink 1s step-end infinite;
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.3 }
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
        <div className="px-6 py-3.5 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <div className="font-mono text-base font-bold tracking-tight text-primary select-none">
              typecraft<span className="text-muted-foreground/40">.io</span>
            </div>
            <div className="flex gap-3.5 font-mono text-[10px] text-muted-foreground/40">
              <span>best <span className="text-muted-foreground">{bestWpm}wpm</span></span>
              <span>sessions <span className="text-muted-foreground">{sessions}</span></span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <ModeToggle />
            <button
              className={`border rounded-md w-7 h-7 flex items-center justify-center text-sm cursor-pointer transition-all duration-150
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
              <button className="bg-secondary border border-border text-muted-foreground px-2.5 py-1 rounded-md text-[11px] font-mono cursor-pointer transition-all duration-150 hover:bg-accent hover:text-primary" onClick={restart}>restart</button>
              <button className="bg-secondary border border-border text-muted-foreground px-2.5 py-1 rounded-md text-[11px] font-mono cursor-pointer transition-all duration-150 hover:bg-accent hover:text-primary" onClick={reset}>new text</button>
            </>}
          </div>
        </div>

        {/* Stats bar */}
        {isActive && <div className="flex gap-0 px-6 shrink-0 border-b border-border">
          <div className="py-3 px-5 flex items-baseline gap-1.5 border-r border-border">
            <div className="font-mono text-xl font-bold text-primary leading-none">{wpm}</div>
            <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">wpm</div>
          </div>
          <div className="py-3 px-5 flex items-baseline gap-1.5 border-r border-border">
            <div className="font-mono text-xl font-bold text-primary leading-none">{accuracy}%</div>
            <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">acc</div>
          </div>
          <div className="py-3 px-5 flex items-baseline gap-1.5 border-r border-border">
            <div className="font-mono text-xl font-bold text-primary leading-none">{errors}</div>
            <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">err</div>
          </div>
          <div className="py-3 px-5 flex items-baseline gap-1.5 border-r border-border">
            <div className="font-mono text-xl font-bold text-primary leading-none">{fmt(elapsed)}</div>
            <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">time</div>
          </div>
          <div className="py-3 px-5 flex items-baseline gap-1.5">
            <div className="font-mono text-xl font-bold text-primary leading-none">
              {typed.length}<span className="text-muted-foreground/40 font-normal">/{activeText.length}</span>
            </div>
            <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">chars</div>
          </div>
        </div>}

        {/* Progress bar */}
        {isActive && <div className="h-0.5 bg-border/50 shrink-0">
          <div className="h-full bg-primary transition-[width] duration-100 rounded-r-sm" style={{ width: `${pct}%` }} />
        </div>}

        {/* Main workspace */}
        <div className="flex-1 flex min-h-0">
          {/* Typing area */}
          <div className="flex-1 p-6 px-8 flex flex-col relative cursor-text min-h-0" onClick={() => typingRef.current?.focus()}>
            {isActive ? <>
              <div className="text-[10px] uppercase tracking-[2.5px] text-muted-foreground/20 mb-3.5 font-semibold shrink-0 transition-colors duration-200 group-focus-within:text-muted-foreground">
                {startRef.current ? "typing..." : "start typing"}
              </div>
              <div
                ref={displayRef}
                className="font-mono text-lg leading-[2.2] tracking-wide flex-1 overflow-y-auto break-all"
                style={{ scrollbarWidth: "none" }}
              >
                {activeText.split("").map((ch, i) => {
                  const s = status(i);
                  const cur = i === typed.length;
                  const sp = ch === " ";
                  let cn = "relative whitespace-pre";
                  if (s === "err" && sp) cn += " bg-destructive/20 rounded-sm";
                  else if (s === "err") cn += " text-destructive bg-destructive/10 rounded-sm";
                  else if (s === "ok") cn += " text-muted-foreground";
                  else cn += " text-muted-foreground/20";
                  if (cur) cn += " cur-char relative z-[1] text-primary-foreground";
                  return <span key={i} className={cn}>{ch}</span>;
                })}
              </div>
              <input ref={typingRef} className="absolute opacity-0 w-0 h-0 pointer-events-none" onKeyDown={onKey} autoFocus tabIndex={0} />
              {!startRef.current && !isFinished && (
                <div
                  className="absolute bottom-4.5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/20 font-mono pointer-events-none"
                  style={{ animation: "hint-pulse 2s ease-in-out infinite" }}
                >
                  click here · start typing
                </div>
              )}

              {/* Finished overlay */}
              {isFinished && (
                <div
                  className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-10"
                  style={{ animation: "finish-in 0.3s ease" }}
                >
                  <div className="text-[9px] uppercase tracking-[3px] text-primary font-bold bg-primary/5 px-3.5 py-1.5 rounded-2xl border border-primary/10">
                    completed
                  </div>
                  <div className="flex gap-9">
                    <div className="text-center">
                      <div className="font-mono text-4xl font-bold text-foreground">{wpm}</div>
                      <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">wpm</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-4xl font-bold text-foreground">{accuracy}%</div>
                      <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-4xl font-bold text-foreground">{errors}</div>
                      <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">errors</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-4xl font-bold text-foreground">{fmt(elapsed)}</div>
                      <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold">time</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button className="px-4.5 py-2.5 rounded-lg font-[Outfit,sans-serif] text-xs font-medium cursor-pointer transition-all duration-150 bg-primary text-primary-foreground hover:opacity-90" onClick={restart}>try again</button>
                    <button className="px-4.5 py-2.5 rounded-lg font-[Outfit,sans-serif] text-xs font-medium cursor-pointer transition-all duration-150 bg-transparent text-muted-foreground border border-border hover:bg-accent hover:text-primary" onClick={reset}>new text</button>
                  </div>
                </div>
              )}
            </> : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2.5 p-10">
                <div className="text-3xl opacity-10 mb-1">⌨</div>
                <h2 className="text-base font-medium text-muted-foreground">ready to practice?</h2>
                <p className="text-muted-foreground/60 text-xs text-center max-w-[280px] leading-relaxed">Paste any text on the right — articles, code, paragraphs — and start typing.</p>
              </div>
            )}
          </div>

          {/* Paste panel */}
          {showPaste && (
            <div className="w-[340px] shrink-0 flex flex-col border-l border-border bg-card/50">
              <div className="px-4.5 py-3.5 border-b border-border">
                <div className="text-[10px] uppercase tracking-[2.5px] text-muted-foreground/40 font-semibold">paste your text</div>
              </div>
              <div className="flex-1 p-4.5 min-h-0">
                <textarea
                  className="w-full h-full bg-transparent border-none text-muted-foreground font-mono text-xs leading-[1.8] resize-none outline-none placeholder:text-muted-foreground/20"
                  style={{ scrollbarWidth: "none" }}
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  placeholder={"Paste anything here...\n\narticle, paragraph, code,\nor any text you want to\npractice typing.\n\nProgress saves automatically\nso you can resume anytime."}
                  spellCheck={false}
                />
              </div>
              <div className="p-4.5 border-t border-border">
                <button
                  className="w-full bg-primary text-primary-foreground border-none py-2.5 rounded-lg font-[Outfit,sans-serif] text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => {
                    const t = sourceText.trim() || SAMPLE_TEXT;
                    setSourceText(t); setActiveText(t); setTyped("");
                    setIsActive(true); startRef.current = null;
                    setElapsed(0); setWpm(0); setAccuracy(100); setErrors(0); setTotalKeystrokes(0);
                    setIsFinished(false); setShowPaste(false);
                    setTimeout(() => typingRef.current?.focus(), 50);
                  }}
                >
                  {sourceText.trim() ? "start practice →" : "use sample text →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts footer */}
        <div className="flex gap-3.5 justify-center py-2 shrink-0 border-t border-border">
          <span className="font-mono text-[9px] text-muted-foreground/20">
            <kbd className="bg-secondary border border-border px-1 py-px rounded text-muted-foreground/40 text-[9px] mr-0.5">tab</kbd> restart
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/20">
            <kbd className="bg-secondary border border-border px-1 py-px rounded text-muted-foreground/40 text-[9px] mr-0.5">esc</kbd> new text
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/20">
            <kbd className="bg-secondary border border-border px-1 py-px rounded text-muted-foreground/40 text-[9px] mr-0.5">⌫</kbd> fix errors
          </span>
        </div>
      </div>
    </>
  );
}
