// Steely — the mascot, as per-stage raster images. The hand-made art lives in /mascot (see
// mascot/README.md for the spec: PNG with alpha, 252×252, six expressions). This controller just
// swaps the <img> src when the app changes stage. It is fully self-contained and OPTIONAL: until the
// image files exist, it shows nothing (never a broken-image icon), and the app never depends on it.
//
// Public contract (unchanged from before): window.steely.setStage(name) — the UI calls this and
// nothing else. Loaded as a plain <script defer>.

(function () {
  'use strict';

  // ---- the six canonical expressions, and which app stage maps to each ----
  // App stages are signalled by ui.js via steelyStage(...). Several map onto one expression.
  const ALIAS = {
    input: 'input', family: 'family', checklist: 'checklist',
    accuse: 'gap', inconclusive_lean: 'gap', confirmed: 'gap',
    valid_earned: 'holds', cynic_valid: 'skeptic', cynic_unsure: 'skeptic', cynic_after_reject: 'skeptic',
  };
  const EXPRESSIONS = ['input', 'family', 'checklist', 'gap', 'holds', 'skeptic'];

  // File path for an expression. Keep in sync with mascot/README.md and mascot/manifest.json.
  const srcFor = (expr) => `mascot/steely-${expr}.png`;

  let img = null;
  let current = null;
  const ok = Object.create(null);   // expr -> true once we've confirmed its file loads

  // Preload each expression once; remember which ones actually exist so setStage never points the
  // visible <img> at a missing file (which would flash a broken icon before onerror fires).
  function preload() {
    for (const expr of EXPRESSIONS) {
      const probe = new Image();
      probe.onload = () => {
        ok[expr] = true;
        // If we're already on this stage but the image hadn't loaded yet, reveal it now.
        if (current === expr) show(expr);
      };
      probe.onerror = () => { /* no file yet — stay hidden for this expr */ };
      probe.src = srcFor(expr);
    }
  }

  function show(expr) {
    if (!img) return;
    if (ok[expr]) {
      img.src = srcFor(expr);
      img.hidden = false;
    } else {
      // No art for this expression (yet): hide rather than show a broken icon.
      img.hidden = true;
    }
  }

  const controller = {
    setStage(appStage) {
      const expr = ALIAS[appStage] || (EXPRESSIONS.includes(appStage) ? appStage : null);
      if (!expr) return;
      current = expr;
      show(expr);
    },
    current: () => current,
  };

  function start() {
    img = document.getElementById('mascot-img');
    if (!img) return;
    preload();
    window.steely = controller;
    controller.setStage('input');   // first screen
  }

  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);
})();
