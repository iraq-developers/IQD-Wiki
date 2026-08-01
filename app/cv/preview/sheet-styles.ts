/* ══════════════════════════════════════════════════════
   A4 SHEET STYLESHEET

   Static string — injected once, never rebuilt. Everything
   that used to be interpolated per render (accent colour)
   and everything the fit engine needs to tweak (density)
   is a CSS custom property instead:

     --cv-accent   the theme colour
     --cv-d        density multiplier, 0.75 – 1.15

   Sizes are `calc(<base>px * var(--cv-d))` so one variable
   change re-flows the whole document with no React work.
══════════════════════════════════════════════════════ */

export const SHEET_PAD_TOP = 30;
export const SHEET_PAD_X = 42;
export const SHEET_PAD_BOTTOM = 42;

export const CV_SHEET_CSS = `
.cv-sheet-preview {
  --cv-accent: #1e40af;
  --cv-d: 1;

  font-family: var(--font-cv, 'Inter'), ui-sans-serif, system-ui, sans-serif;
  width: 794px;
  height: 1123px;
  overflow: hidden;
  background: #fff;
  color: #374151;
  position: relative;
  padding: ${SHEET_PAD_TOP}px ${SHEET_PAD_X}px ${SHEET_PAD_BOTTOM}px;
  box-sizing: border-box;
  /* The sheet is a fixed-size document: never let it inherit page direction. */
  direction: ltr;
  text-align: left;
}
.cv-sheet-preview *,
.cv-sheet-preview *::before,
.cv-sheet-preview *::after { box-sizing: border-box; }

/* When content spills, the preview grows so the user can see what's
   being cut. Export always rasterises the first 1123px regardless. */
.cv-sheet-preview[data-spill="true"] {
  height: auto;
  min-height: 1123px;
  overflow: visible;
}

/* ── Header ── */
.cp-header { margin-bottom: calc(16px * var(--cv-d)); }
.cp-header-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.cp-name {
  font-size: calc(30px * var(--cv-d));
  font-weight: 800; color: #111; margin: 0;
  line-height: 1.15; letter-spacing: -.3px;
}
.cp-title {
  font-size: calc(20px * var(--cv-d));
  font-weight: 600; color: var(--cv-accent);
  margin: calc(3px * var(--cv-d)) 0 0;
}
.cp-contact {
  text-align: right;
  font-size: calc(11.5px * var(--cv-d));
  color: #555; line-height: 1.7; flex-shrink: 0;
}
.cp-contact-links {
  margin-top: 3px; display: flex; flex-direction: column;
  align-items: flex-end; gap: 1px;
}
.cp-summary {
  margin-top: calc(10px * var(--cv-d));
  font-size: calc(12px * var(--cv-d));
  line-height: 1.6; color: #374151;
}

/* ── Section ── */
.cp-section { margin-bottom: calc(14px * var(--cv-d)); }
.cp-section:last-child { margin-bottom: 0; }
.cp-section-h2 {
  font-size: calc(16px * var(--cv-d));
  font-weight: 700; text-transform: uppercase; letter-spacing: .7px;
  color: var(--cv-accent);
  margin: 0 0 calc(4px * var(--cv-d));
}

/* ── Skills ── */
.cp-skills-row {
  font-size: calc(11.5px * var(--cv-d));
  line-height: 1.6; color: #374151; margin: 0;
}
.cp-skill-label { font-weight: 700; color: #111; }

/* ── Blocks (jobs / projects) ── */
.cp-block { margin-bottom: calc(10px * var(--cv-d)); }
.cp-block:last-child { margin-bottom: 0; }
.cp-block-title {
  font-size: calc(12.5px * var(--cv-d));
  font-weight: 700; color: #111;
  margin: 0 0 calc(3px * var(--cv-d));
  line-height: 1.3; display: flex; flex-wrap: wrap; align-items: center; gap: 4px;
}
.cp-block-desc {
  font-size: calc(11.5px * var(--cv-d));
  line-height: 1.5; color: #374151;
  margin: calc(2px * var(--cv-d)) 0 calc(4px * var(--cv-d));
}

/* ── Lists ── */
.cp-ul { margin: calc(2px * var(--cv-d)) 0 0; padding-left: 18px; list-style: disc; }
.cp-li {
  font-size: calc(11.5px * var(--cv-d));
  line-height: 1.5; color: #374151;
  margin-bottom: calc(1.5px * var(--cv-d));
}
.cp-plain { font-size: calc(11.5px * var(--cv-d)); line-height: 1.5; color: #374151; margin: 0; }

.cp-link { color: var(--cv-accent); text-decoration: underline; }
.cp-sep { color: #9ca3af; margin: 0 3px; }

/* ── Page-break chrome (preview only — never exported) ── */
.cp-page-line {
  position: absolute; left: 0; right: 0; top: 1123px;
  border-top: 2px dashed #dc2626;
  pointer-events: none;
}
.cp-page-line-tag {
  position: absolute; right: 0; top: 4px;
  background: #dc2626; color: #fff;
  font-size: 10px; font-weight: 600; letter-spacing: .04em;
  padding: 2px 7px; border-radius: 0 0 4px 4px;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.cp-spill-tint {
  position: absolute; left: 0; right: 0; top: 1123px; bottom: 0;
  background: repeating-linear-gradient(
    45deg, rgba(220,38,38,.05) 0 10px, rgba(220,38,38,.11) 10px 20px
  );
  pointer-events: none;
}

/* ══════════════════════════════════════════════════════
   PRINT — vector, selectable text straight to A4.
   Everything but the sheet is hidden with visibility
   (not display) so no layout is disturbed.
══════════════════════════════════════════════════════ */
@media print {
  @page { size: A4 portrait; margin: 0; }

  html, body {
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
  }
  body * { visibility: hidden !important; }

  .cv-sheet-preview, .cv-sheet-preview * {
    visibility: visible !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Ancestors must drop their transforms, or the absolute
     positioning below would resolve against them. */
  .cv-scale-wrap, .cv-scale-outer, .cv-scale-box {
    width: auto !important;
    transform: none !important;
    height: auto !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .cv-sheet-preview {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    min-height: 0 !important;
    overflow: hidden !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
  }

  .cp-page-line, .cp-page-line-tag, .cp-spill-tint,
  [data-export-hide="true"] { display: none !important; }
}
`;
