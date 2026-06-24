// Steely — the p5.js mascot. ISOLATED on purpose: p5 is a CDN dependency and this whole module is
// best-effort. If p5 fails to load, or anything here throws, the app is unaffected — index.html
// shows the static src/mascot.svg fallback and the core flow (paste → checklist → verdict) never
// depends on this file. The UI signals stage via window.steely.setStage(name); nothing calls into
// p5 directly. Implements guidance/MASCOT-SPEC.md.
//
// Loaded as a plain <script defer> (NOT a module) so it can use the global `p5` from the CDN.

(function () {
  'use strict';

  // ---- expression parameter sets (the spec's per-stage table, as plain numbers) ----
  // Coordinates are in the spec's 120×130 space; the sketch scales to its canvas.
  // eyeR, pupilDX/DY, browOn (0/1), browInnerUp(+deg inner-up), browRaise, browOneSide(-1 L,0 both,1 R),
  // mouthW, mouthDepth (+up / -down), mouthCornerR (extra px up on right corner),
  // eyeCrescent (0 dots / 1 happy u-arcs),
  // armMode: 'holdUp'|'chin'|'palmUp'|'taDa'|'shrug', leanDeg(+toward user/right),
  // bubble: {opacity, glyph:''|'?'|'mark', glow 0/1, y(offset), dotted 0/1},
  // floatAmp, floatPeriod(ms)
  const BASE = {
    eyeR: 5, pupilDX: 0, pupilDY: 0,
    browOn: 0, browInnerUp: 0, browRaise: 0, browOneSide: 0,
    mouthW: 12, mouthDepth: 3, mouthCornerR: 0, eyeCrescent: 0,
    armMode: 'holdUp', leanDeg: 0,
    bubOpacity: 1, bubGlyph: '', bubGlow: 0, bubY: 0, bubDotted: 0,
    floatAmp: 2.5, floatPeriod: 2600,
  };
  const STAGES = {
    input: { eyeR: 5.5, mouthW: 14, mouthDepth: 4, bubDotted: 1, bubGlyph: '', bubPulse: 1, leanDeg: 2, floatAmp: 2.5, floatPeriod: 2600 },
    family: { pupilDX: 2, browOn: 1, browOneSide: 1, browRaise: 2, mouthW: 10, mouthDepth: 1.5, mouthCornerR: 1, armMode: 'chin', leanDeg: 3, bubOpacity: 0.6, bubGlyph: '?', floatPeriod: 2900 },
    checklist: { eyeR: 4.5, pupilDY: 1, mouthW: 13, mouthDepth: 4, armMode: 'holdUp', bubY: -2, floatAmp: 1.5, floatPeriod: 2600 },
    gap: { eyeR: 5, pupilDX: 0, pupilDY: -1.5, browOn: 1, browInnerUp: 3, browRaise: 3, browOneSide: 0, mouthW: 9, mouthDepth: -0.5, mouthCornerR: -1, armMode: 'palmUp', leanDeg: 0, bubGlyph: 'mark', floatAmp: 1, floatPeriod: 3000 },
    holds: { eyeCrescent: 1, mouthW: 16, mouthDepth: 6, armMode: 'taDa', bubGlow: 1, bubY: -3, floatAmp: 3.5, floatPeriod: 2200 },
    skeptic: { eyeR: 5, pupilDX: 2, mouthW: 11, mouthDepth: 3, mouthCornerR: 1, armMode: 'shrug', leanDeg: -3, bubY: 6, floatAmp: 2.5, floatPeriod: 2800 },
  };
  const STAGE_ALIASES = { // map app verdict kinds → mascot stages
    input: 'input', family: 'family', checklist: 'checklist',
    accuse: 'gap', inconclusive_lean: 'gap',
    valid_earned: 'holds', cynic_valid: 'skeptic', cynic_unsure: 'skeptic',
    confirmed: 'gap', cynic_after_reject: 'skeptic',
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // current + target parameter objects; we tween cur→target each frame
  const keysNum = Object.keys(BASE);
  function resolved(stageName) {
    const s = STAGES[stageName] || STAGES.input;
    const out = {};
    for (const k of keysNum) out[k] = (k in s) ? s[k] : BASE[k];
    out._stage = stageName;
    out.bubPulse = s.bubPulse || 0;
    return out;
  }

  let cur = resolved('input');
  let target = resolved('input');
  let tweenT = 1;              // 0..1 progress of current tween
  let entryFx = null;         // {kind, t} one-shot accents (pop, sparkle, shrugBob, tilt)

  // public controller — the ONLY surface the app touches
  const controller = {
    setStage(appStage) {
      const name = STAGE_ALIASES[appStage] || (STAGES[appStage] ? appStage : null);
      if (!name) return;                 // unknown → ignore, keep current
      if (target._stage === name) return;
      cur = snapshot();                  // freeze where we are
      target = resolved(name);
      tweenT = 0;
      if (name === 'holds') entryFx = { kind: 'pop', t: 0 };
      else if (name === 'skeptic') entryFx = { kind: 'shrugBob', t: 0 };
      else if (name === 'gap') entryFx = { kind: 'tilt', t: 0 };
      else entryFx = null;
    },
  };
  function snapshot() { const o = {}; for (const k of keysNum) o[k] = cur[k]; o._stage = cur._stage; o.bubPulse = cur.bubPulse; return o; }

  // ---- the sketch (instance mode; never touches globals beyond the canvas) ----
  function sketch(p) {
    const VW = 120, VH = 130;
    let t0 = 0;

    p.setup = function () {
      const host = document.getElementById('mascot-canvas');
      if (!host) { p.noLoop(); return; }
      const size = host.clientWidth || 96;
      const c = p.createCanvas(size, size * (VH / VW));
      c.parent(host);
      p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
      if (reduced) p.noLoop();           // still pose only
      t0 = p.millis();
    };

    p.windowResized = function () {
      const host = document.getElementById('mascot-canvas');
      if (host) p.resizeCanvas(host.clientWidth || 96, (host.clientWidth || 96) * (VH / VW));
      if (reduced) p.redraw();
    };

    p.draw = function () {
      const now = p.millis();
      // advance tween
      if (tweenT < 1) tweenT = Math.min(1, tweenT + (reduced ? 1 : p.deltaTime / 350));
      const e = easeInOut(tweenT);
      const s = {};
      for (const k of keysNum) s[k] = lerp(cur[k], target[k], e);
      s._stage = target._stage;
      s.bubPulse = target.bubPulse;
      // advance entry one-shot
      if (entryFx && !reduced) { entryFx.t = Math.min(1, entryFx.t + p.deltaTime / 450); if (entryFx.t >= 1) entryFx = null; }

      p.clear();
      const scale = p.width / VW;
      p.push();
      p.scale(scale);

      // idle float + entry pop
      const tt = (now - t0) / 1000;
      let floatY = reduced ? 0 : Math.sin((tt * 2 * Math.PI) / (s.floatPeriod / 1000)) * s.floatAmp;
      let popScale = 1, bobY = 0, tiltExtra = 0;
      if (entryFx) {
        if (entryFx.kind === 'pop') { const k = entryFx.t; popScale = k < 0.4 ? lerp(0.94, 1.04, k / 0.4) : lerp(1.04, 1.0, (k - 0.4) / 0.6); }
        if (entryFx.kind === 'shrugBob') bobY = -2 * Math.sin(entryFx.t * Math.PI);
        if (entryFx.kind === 'tilt') tiltExtra = 3 * Math.sin(entryFx.t * Math.PI);
      }
      p.translate(VW / 2, VH / 2 + floatY + bobY);
      p.rotate(((s.leanDeg + tiltExtra) * Math.PI) / 180);
      p.scale(popScale);
      p.translate(-VW / 2, -VH / 2);

      drawSteely(p, s, tt);
      p.pop();
    };

    function easeInOut(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  }

  // ---- drawing (all from rects/ellipses/arcs per the spec) ----
  const BODY = '#909696', BODY_DK = '#7d8484', PAPER = '#faf6ef';
  const SAGE = '#5b6f5a', AMBER = '#c98a3c';

  function drawSteely(p, s, tt) {
    p.noStroke();

    // --- bubble (held aloft) ---
    const bx = 60, by = 16 + s.bubY;
    p.push();
    let bubAlpha = s.bubOpacity;
    if (s.bubPulse && !reduced) bubAlpha = lerp(0.45, 0.7, (Math.sin(tt * Math.PI) + 1) / 2);
    // glow (holds-up only)
    if (s.bubGlow > 0.01) {
      p.noStroke();
      const g = s.bubGlow * (reduced ? 0.5 : (0.45 + 0.15 * Math.sin(tt * 3)));
      p.fill(91, 111, 90, 255 * 0.18 * g);
      p.ellipse(bx, by, 46, 40);
    }
    p.noFill();
    p.stroke(SAGE); p.strokeWeight(1.6);
    if (s.bubDotted) p.drawingContext.setLineDash([2.5, 2.5]); else p.drawingContext.setLineDash([]);
    p.drawingContext.globalAlpha = bubAlpha;
    roundRect(p, bx - 15, by - 10, 30, 20, 6);
    p.drawingContext.setLineDash([]);
    // tail
    p.fill(PAPER); p.noStroke();
    p.triangle(bx - 4, by + 9, bx + 4, by + 9, bx, by + 15);
    p.noFill(); p.stroke(SAGE); p.strokeWeight(1.6);
    p.line(bx - 4, by + 10, bx, by + 15); p.line(bx + 4, by + 10, bx, by + 15);
    // glyph
    p.drawingContext.globalAlpha = bubAlpha;
    if (s.bubGlyph === '?') { p.noStroke(); p.fill(SAGE); p.textAlign(p.CENTER, p.CENTER); p.textSize(11); p.textStyle(p.BOLD); p.text('?', bx, by - 1); }
    else if (s.bubGlyph === 'mark') { p.noStroke(); p.fill(AMBER); const mp = reduced ? 1 : (0.6 + 0.4 * Math.sin(tt * 4)); p.drawingContext.globalAlpha = bubAlpha * mp; p.circle(bx + 9, by - 5, 4); }
    else { /* lines suggesting text, when present & opaque */
      if (bubAlpha > 0.55 && !s.bubDotted) { p.stroke(SAGE); p.strokeWeight(1.6); p.drawingContext.globalAlpha = bubAlpha * 0.5; p.line(bx - 9, by - 3, bx + 9, by - 3); p.line(bx - 9, by + 3, bx + 5, by + 3); }
    }
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // --- arms (pose-dependent) ---
    drawArms(p, s, by);

    // --- I-beam body ---
    p.noStroke(); p.fill(BODY);
    roundRectFill(p, 32, 30, 56, 10, 3);          // top flange
    roundRectFill(p, 48, 40, 24, 46, 4);          // web
    // bottom flange w/ foot notch
    roundRectFill(p, 32, 86, 56, 10, 3);
    p.fill(PAPER); p.rect(57, 92, 6, 6);          // notch implies two feet
    // top-edge sheen
    p.fill(255, 255, 255, 40); p.rect(34, 31, 52, 1.4);
    // rivets
    p.fill(BODY_DK);
    for (const [rx, ry] of [[50, 42], [70, 42], [50, 84], [70, 84]]) p.circle(rx, ry, 2.2);

    // --- face (on the web) ---
    drawFace(p, s, tt);
  }

  function drawArms(p, s, by) {
    p.noFill(); p.stroke(BODY); p.strokeWeight(2.4); p.strokeCap(p.ROUND);
    const Lsh = [49, 66], Rsh = [71, 66];   // shoulders
    let Lhand, Rhand;
    switch (s.armMode) {
      case 'chin': Lhand = [48, by + 10]; Rhand = [55, 42]; break;          // one hand to chin
      case 'palmUp': Lhand = [49, by + 10]; Rhand = [76, by + 6]; break;    // palm-up beside bubble
      case 'taDa': Lhand = [44, by + 4]; Rhand = [76, by + 4]; break;       // lift high, spread
      case 'shrug': Lhand = [42, 70]; Rhand = [80, 66]; break;              // open shrug
      default: Lhand = [48, by + 10]; Rhand = [72, by + 10];                // holdUp
    }
    armCurve(p, Lsh, Lhand);
    armCurve(p, Rsh, Rhand);
    p.noStroke(); p.fill(BODY);
    p.circle(Lhand[0], Lhand[1], 3.2); p.circle(Rhand[0], Rhand[1], 3.2);
  }
  function armCurve(p, a, b) {
    const cx = (a[0] + b[0]) / 2 + (b[0] < 60 ? -6 : 6), cy = Math.min(a[1], b[1]) - 4;
    p.noFill(); p.beginShape(); p.vertex(a[0], a[1]); p.quadraticVertex(cx, cy, b[0], b[1]); p.endShape();
  }

  function drawFace(p, s, tt) {
    const eyes = [[52, 56], [68, 56]];
    // blink (skip for crescents / reduced)
    let blink = 1;
    if (!reduced && s.eyeCrescent < 0.5) { const cyc = (tt % 4); if (cyc > 3.9) blink = Math.max(0.1, 1 - (cyc - 3.9) / 0.05); }
    // eyes
    p.noStroke();
    for (const [ex, ey] of eyes) {
      const x = ex + s.pupilDX, y = ey + s.pupilDY;
      if (s.eyeCrescent > 0.5) { // happy u-arc
        p.noFill(); p.stroke(SAGE); p.strokeWeight(2); p.strokeCap(p.ROUND);
        p.arc(ex, ey + 1, 8, 7, p.PI * 0.15, p.PI * 0.85);
        p.noStroke();
      } else {
        p.fill(PAPER);
        p.push(); p.translate(x, y); p.scale(1, blink); p.circle(0, 0, s.eyeR * 2); p.pop();
      }
    }
    // eyebrows
    if (s.browOn > 0.05) {
      p.stroke(PAPER); p.strokeWeight(1.8); p.strokeCap(p.ROUND);
      p.drawingContext.globalAlpha = s.browOn;
      const drawBrow = (cx) => {
        const innerUp = s.browInnerUp;          // +deg inner end up
        const baseY = 49 - s.browRaise;
        const inner = cx < 60 ? cx + 4 : cx - 4, outer = cx < 60 ? cx - 4 : cx + 4;
        p.line(inner, baseY - innerUp * 0.4, outer, baseY + innerUp * 0.2);
      };
      if (s.browOneSide === 0) { drawBrow(52); drawBrow(68); }
      else if (s.browOneSide > 0) drawBrow(68); else drawBrow(52);
      p.drawingContext.globalAlpha = 1; p.noStroke();
    }
    // mouth — arc; positive depth = smile, negative = slight concern line
    p.noFill(); p.stroke(reduced && s.eyeCrescent > 0.5 ? SAGE : PAPER); p.strokeWeight(2.2); p.strokeCap(p.ROUND);
    const mx = 60, my = 72, w = s.mouthW, d = s.mouthDepth;
    if (Math.abs(d) < 1.2) { // near-flat with one-corner dip (gap-found)
      p.line(mx - w / 2, my, mx + w / 2, my + (s.mouthCornerR < 0 ? 1 : 0));
    } else if (d > 0) {
      p.beginShape(); p.vertex(mx - w / 2, my); p.quadraticVertex(mx, my + d * 1.4, mx + w / 2, my - s.mouthCornerR); p.endShape();
    } else {
      p.beginShape(); p.vertex(mx - w / 2, my); p.quadraticVertex(mx, my + d * 1.4, mx + w / 2, my); p.endShape();
    }
    p.noStroke();
  }

  function roundRect(p, x, y, w, h, r) { p.rect(x, y, w, h, r); }     // for stroked (noFill set by caller)
  function roundRectFill(p, x, y, w, h, r) { p.rect(x, y, w, h, r); }

  // ---- bootstrap: load p5 from CDN, start the sketch, all best-effort ----
  function start() {
    try {
      const host = document.getElementById('mascot-canvas');
      if (!host || typeof p5 === 'undefined') return false;
      // hide the static SVG fallback once the canvas is live
      const fallback = document.getElementById('mascot-fallback');
      // eslint-disable-next-line no-new
      new p5(sketch);
      if (fallback) fallback.style.display = 'none';
      window.steely = controller;
      return true;
    } catch (e) { console.warn('Steely (p5 mascot) failed; using static fallback.', e); return false; }
  }

  // p5 may already be present (script order) or still loading. Try now, then on window load.
  window.addEventListener('steely:p5ready', start);
  if (document.readyState !== 'loading') setTimeout(start, 0);
  else window.addEventListener('DOMContentLoaded', () => setTimeout(start, 0));
})();
