// Steely — the mascot, as a dependency-free animated inline SVG. No p5, no CDN, no network: works
// offline, a few KB, themes via the page's CSS variables. Implements guidance/MASCOT-SPEC.md.
//
// Same public contract as before: window.steely.setStage(name) changes the expression. The UI only
// ever calls that; the mascot is otherwise self-contained. Expressions are per-stage attribute sets
// applied to named SVG nodes; CSS transitions tween between them and respect prefers-reduced-motion.
//
// Loaded as a plain <script defer> (not a module).

(function () {
  'use strict';

  const SVGNS = 'http://www.w3.org/2000/svg';
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- per-stage expression sets (the spec's table) ----
  // Each value is a target the SVG nodes animate toward via CSS transitions.
  //  eyeR, pupilDX/DY, crescent(0/1)
  //  brow: 'off'|'both'|'oneR'|'tentUp'  + browRaise(px up)
  //  mouth: 'smileSm'|'smileMd'|'smileLg'|'flatDip'|'easy'  (path presets)
  //  arms:  'holdUp'|'chin'|'palmUp'|'taDa'|'shrug'
  //  bubble: 'empty'|'q'|'plain'|'mark'|'glow'|'rest'
  //  lean(deg), floatClass
  const STAGES = {
    input:     { eyeR: 5.5, pupilDX: 0, pupilDY: 0, crescent: 0, brow: 'off',    mouth: 'smileMd', arms: 'holdUp', bubble: 'empty', lean: 1 },
    family:    { eyeR: 5,   pupilDX: 2, pupilDY: 0, crescent: 0, brow: 'oneR',   mouth: 'smileSm', arms: 'chin',   bubble: 'q',     lean: 3 },
    checklist: { eyeR: 4.6, pupilDX: 0, pupilDY: 1, crescent: 0, brow: 'off',    mouth: 'smileMd', arms: 'holdUp', bubble: 'plain', lean: 0 },
    gap:       { eyeR: 5,   pupilDX: 0, pupilDY: -1, crescent: 0, brow: 'tentUp', mouth: 'flatDip', arms: 'palmUp', bubble: 'mark',  lean: 0 },
    holds:     { eyeR: 5,   pupilDX: 0, pupilDY: 0, crescent: 1, brow: 'off',    mouth: 'smileLg', arms: 'taDa',   bubble: 'glow',  lean: 0 },
    skeptic:   { eyeR: 5,   pupilDX: 2, pupilDY: 0, crescent: 0, brow: 'off',    mouth: 'easy',    arms: 'shrug',  bubble: 'rest',  lean: -3 },
  };
  // map app verdict kinds → mascot stages
  const ALIAS = {
    input: 'input', family: 'family', checklist: 'checklist',
    accuse: 'gap', inconclusive_lean: 'gap', confirmed: 'gap',
    valid_earned: 'holds', cynic_valid: 'skeptic', cynic_unsure: 'skeptic', cynic_after_reject: 'skeptic',
  };

  // mouth path presets (centered ~60,72 in the 120×130 viewbox)
  const MOUTH = {
    smileSm: 'M53 72 Q60 76 67 71',
    smileMd: 'M52 71 Q60 78 68 71',
    smileLg: 'M51 70 Q60 82 69 70',
    flatDip: 'M54 73 L66 73.5',     // near-flat, faint one-corner dip — open question, never a frown
    easy:    'M53 72 Q60 77 68 70',
  };
  // arm hand targets [Lx,Ly,Rx,Ry] (shoulders fixed at 49,66 / 71,66)
  const ARMS = {
    holdUp: [48, 26, 72, 26],
    chin:   [48, 28, 55, 42],
    palmUp: [49, 30, 78, 24],
    taDa:   [42, 20, 78, 20],
    shrug:  [40, 70, 82, 66],
  };

  let nodes = null;     // cached SVG element refs
  let current = 'input';

  function build(host) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 130');
    svg.setAttribute('class', 'steely');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `
      <g class="steely-rig">
        <!-- glow (holds-up only) -->
        <ellipse class="st-glow" cx="60" cy="16" rx="24" ry="20"/>
        <!-- bubble -->
        <g class="st-bubble">
          <rect class="st-bub-box" x="45" y="6" width="30" height="20" rx="6"/>
          <path class="st-bub-tail" d="M56 25 l4 6 4-6 z"/>
          <line class="st-bub-l1" x1="51" y1="13" x2="69" y2="13"/>
          <line class="st-bub-l2" x1="51" y1="19" x2="64" y2="19"/>
          <text class="st-bub-q" x="60" y="20" text-anchor="middle">?</text>
          <circle class="st-bub-mark" cx="69" cy="9" r="2.4"/>
        </g>
        <!-- arms -->
        <path class="st-arm st-arm-l" d=""/>
        <path class="st-arm st-arm-r" d=""/>
        <circle class="st-hand st-hand-l" r="1.8"/>
        <circle class="st-hand st-hand-r" r="1.8"/>
        <!-- I-beam body -->
        <rect class="st-flange" x="32" y="30" width="56" height="10" rx="3"/>
        <rect class="st-web" x="48" y="40" width="24" height="46" rx="4"/>
        <rect class="st-flange" x="32" y="86" width="56" height="10" rx="3"/>
        <rect class="st-notch" x="57" y="92" width="6" height="6"/>
        <!-- rivets -->
        <circle class="st-rivet" cx="50" cy="42" r="1.1"/><circle class="st-rivet" cx="70" cy="42" r="1.1"/>
        <circle class="st-rivet" cx="50" cy="84" r="1.1"/><circle class="st-rivet" cx="70" cy="84" r="1.1"/>
        <!-- face -->
        <g class="st-eyes">
          <circle class="st-eye st-eye-l" cx="52" cy="56" r="5"/>
          <circle class="st-eye st-eye-r" cx="68" cy="56" r="5"/>
          <path class="st-cres st-cres-l" d="M48 57 Q52 53 56 57"/>
          <path class="st-cres st-cres-r" d="M64 57 Q68 53 72 57"/>
        </g>
        <path class="st-brow st-brow-l" d="M48 49 L56 49"/>
        <path class="st-brow st-brow-r" d="M64 49 L72 49"/>
        <path class="st-mouth" d="${MOUTH.smileMd}"/>
      </g>`;
    host.appendChild(svg);
    nodes = {
      svg, rig: svg.querySelector('.steely-rig'),
      eyeL: svg.querySelector('.st-eye-l'), eyeR: svg.querySelector('.st-eye-r'),
      eyes: svg.querySelector('.st-eyes'),
      browL: svg.querySelector('.st-brow-l'), browR: svg.querySelector('.st-brow-r'),
      mouth: svg.querySelector('.st-mouth'),
      armL: svg.querySelector('.st-arm-l'), armR: svg.querySelector('.st-arm-r'),
      handL: svg.querySelector('.st-hand-l'), handR: svg.querySelector('.st-hand-r'),
      bubble: svg.querySelector('.st-bubble'),
    };
    return svg;
  }

  function armPath(sx, sy, hx, hy) {
    const cx = (sx + hx) / 2 + (hx < 60 ? -6 : 6), cy = Math.min(sy, hy) - 4;
    return `M${sx} ${sy} Q${cx} ${cy} ${hx} ${hy}`;
  }

  function apply(stageName) {
    if (!nodes) return;
    const s = STAGES[stageName] || STAGES.input;
    const n = nodes;
    // class on the svg drives bubble state + per-stage CSS (glow, pulses, float speed)
    n.svg.setAttribute('class', `steely stage-${stageName} bubble-${s.bubble}`);
    // eyes (dots vs crescents)
    n.eyes.setAttribute('data-crescent', s.crescent ? '1' : '0');
    for (const [eye, base] of [[n.eyeL, 52], [n.eyeR, 68]]) {
      eye.setAttribute('r', s.eyeR);
      eye.setAttribute('cx', base + s.pupilDX);
      eye.setAttribute('cy', 56 + s.pupilDY);
    }
    // brows
    const showL = s.brow === 'both' || s.brow === 'tentUp';
    const showR = s.brow === 'both' || s.brow === 'tentUp' || s.brow === 'oneR';
    n.browL.style.opacity = showL ? '1' : '0';
    n.browR.style.opacity = showR ? '1' : '0';
    if (s.brow === 'tentUp') {
      // inner ends up (worried-WITH-you): L goes inner-up, R goes inner-up
      n.browL.setAttribute('d', 'M48 50 L56 46');
      n.browR.setAttribute('d', 'M64 46 L72 50');
    } else {
      n.browL.setAttribute('d', 'M48 49 L56 49');
      n.browR.setAttribute('d', s.brow === 'oneR' ? 'M64 47 L72 47' : 'M64 49 L72 49');
    }
    // mouth
    n.mouth.setAttribute('d', MOUTH[s.mouth] || MOUTH.smileMd);
    // arms
    const [lx, ly, rx, ry] = ARMS[s.arms] || ARMS.holdUp;
    n.armL.setAttribute('d', armPath(49, 66, lx, ly));
    n.armR.setAttribute('d', armPath(71, 66, rx, ry));
    n.handL.setAttribute('cx', lx); n.handL.setAttribute('cy', ly);
    n.handR.setAttribute('cx', rx); n.handR.setAttribute('cy', ry);
    // lean
    n.rig.style.transform = `rotate(${s.lean}deg)`;
    current = stageName;
  }

  const controller = {
    setStage(appStage) {
      const name = ALIAS[appStage] || (STAGES[appStage] ? appStage : null);
      if (name) apply(name);
    },
    current: () => current,
  };

  function start() {
    try {
      const host = document.getElementById('mascot-canvas');
      if (!host) return;
      const fallback = document.getElementById('mascot-fallback');
      if (fallback) fallback.style.display = 'none';   // replace the static SVG with the live one
      build(host);
      apply('input');
      window.steely = controller;
    } catch (e) {
      console.warn('Steely failed to start; static fallback remains.', e);
    }
  }

  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);
})();
