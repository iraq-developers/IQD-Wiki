"use client";

/** Everything the typing surface needs that Tailwind utilities can't express. */
export default function TypingStyles() {
    return (
        <style>{`
      .typing-surface {
        --type-line: 3.2rem;
        font-family: var(--font-mono-typing), ui-monospace, monospace;
        font-size: 1.5rem;
        line-height: var(--type-line);
        letter-spacing: 0.02em;
      }
      @media (min-width: 768px) {
        .typing-surface { --type-line: 4rem; font-size: 1.9rem; }
      }
      @media (min-width: 1280px) {
        .typing-surface { --type-line: 4.6rem; font-size: 2.2rem; }
      }
      .typing-caret {
        transition: transform 90ms cubic-bezier(0.22, 1, 0.36, 1);
        animation: typing-caret-blink 1.1s ease-in-out infinite;
      }
      @keyframes typing-caret-blink {
        0%, 45% { opacity: 1 }
        60%, 90% { opacity: 0.15 }
        100% { opacity: 1 }
      }
      @keyframes typing-rise {
        from { opacity: 0; transform: translateY(8px) }
        to { opacity: 1; transform: none }
      }
      .typing-rise { animation: typing-rise 320ms cubic-bezier(0.22, 1, 0.36, 1) both }
      @media (prefers-reduced-motion: reduce) {
        .typing-caret { transition: none; animation: none }
        .typing-rise { animation: none }
      }
    `}</style>
    );
}
