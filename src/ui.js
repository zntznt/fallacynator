// Fallacynator UI — positive-first, family-routed checklist.
// All reasoning lives in the (tested) engine; this file gathers a paste, a family choice, and a
// virtue checklist, then asks the engine to score. Adding a fallacy never touches this file.
//
// Flow: paste → (cue scan suggests a family) → pick a family → confirm the argument's virtues
//       (✓ it does this / ✗ it falls short / skip) → tentative+teaching verdict.

import { loadData, scoreChecklist, suggestFamily } from './engine.js';

const app = document.getElementById('app');
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  for (const k of kids) n.append(k);
  return n;
};

let DATA = null;       // loaded bank (incl. families, familyMeta, familyCues, tells)
let argument = '';     // the pasted argument, for reference + cue scan

// ---------- bootstrap ----------
boot();

async function boot() {
  try {
    const [fallacies, questions, families] = await Promise.all([
      fetchJSON('data/fallacies.json'),
      fetchJSON('data/questions.json'),
      fetchJSON('data/families.json'),
    ]);
    DATA = loadData(fallacies, questions, null, families);
    if (DATA.warnings?.length) console.warn('validateBank warnings:', DATA.warnings);
    renderStart();
  } catch (err) {
    renderLoadError(err);
  }
}

async function fetchJSON(path) {
  let res;
  try {
    res = await fetch(path, { cache: 'no-cache' });
  } catch (e) {
    // fetch() of local files fails under file:// — the most common "blank page" cause.
    throw new Error(
      `Could not load ${path}. If you opened index.html directly from disk, ` +
      `serve the folder instead (e.g. "python3 -m http.server" then open http://localhost:8000). ` +
      `On GitHub Pages this works automatically.`
    );
  }
  if (!res.ok) throw new Error(`Could not load ${path} (HTTP ${res.status}).`);
  return res.json();
}

const clear = () => app.replaceChildren();
const familyName = (id) => DATA.familyMeta[id]?.name || id;

// ---------- 1. paste ----------
function renderStart() {
  clear();
  const ta = el('textarea', {
    id: 'arg',
    placeholder: 'e.g. "We can\'t trust her plan — she failed a class in college."',
    value: argument,
  });
  const begin = el('button', { className: 'btn btn-primary', textContent: 'Think it through →' });
  const card = el('section', { className: 'card' },
    el('p', { className: 'kicker', textContent: 'Fallacynator' }),
    el('h1', { textContent: 'Is there a fallacy, or am I just being cynical?' }),
    el('p', {
      className: 'lede',
      textContent:
        'Paste an argument you’re unsure about. We’ll read it as fairly as we can, ' +
        'look at what it does well, and only flag a problem if the good-faith reading ' +
        'genuinely falls short. No accounts, no AI, nothing leaves your browser.',
    }),
    ta,
    el('div', { className: 'row end' }, begin),
    el('p', { className: 'muted', style: 'margin-top:1rem',
      textContent: 'Read it as charitably as you can first. Good arguments deserve a fair hearing.' }),
  );
  app.append(card);
  ta.focus();

  begin.onclick = () => {
    argument = ta.value.trim();
    if (!argument) { ta.focus(); ta.style.outline = '2px solid var(--suspect)'; return; }
    renderFamilyPick();
  };
}

// ---------- 2. pick a family (cue scan suggests, never decides) ----------
function renderFamilyPick() {
  clear();
  const suggestion = suggestFamily(DATA, argument).top;   // may be null
  const order = Object.keys(DATA.familyMeta);
  // put the suggested family first
  const families = suggestion
    ? [suggestion, ...order.filter((f) => f !== suggestion)]
    : order;

  const card = el('section', { className: 'card' });
  if (argument) card.append(el('blockquote', { className: 'recall', textContent: argument }));
  card.append(el('p', { className: 'kicker', textContent: 'Where to look' }));
  card.append(el('h2', { textContent: 'What feels off about it, if anything?' }));
  if (suggestion) {
    card.append(el('p', { className: 'muted',
      textContent: `A quick scan suggests it might be about “${familyName(suggestion)}”, but trust your own read — pick whatever fits.` }));
  } else {
    card.append(el('p', { className: 'muted',
      textContent: 'Pick the kind of problem you suspect — or, if it reads fine, say so.' }));
  }

  const opts = el('div', { className: 'family-list' });
  for (const fam of families) {
    const meta = DATA.familyMeta[fam];
    const b = el('button', { className: 'family-opt' + (fam === suggestion ? ' suggested' : '') },
      el('span', { className: 'family-opt-title', textContent: meta.name }),
      el('span', { className: 'family-opt-sub', textContent: meta.prompt }),
    );
    b.onclick = () => renderChecklist(fam);
    opts.append(b);
  }
  // the goodwill escape hatch
  const fine = el('button', { className: 'family-opt family-opt-fine' },
    el('span', { className: 'family-opt-title', textContent: 'Nothing — it seems sound' }),
    el('span', { className: 'family-opt-sub', textContent: 'Maybe you’re just being a little skeptical, and that’s okay' }),
  );
  fine.onclick = () => renderVerdict(scoreChecklist(DATA, { familyId: 'none' }));
  opts.append(fine);
  card.append(opts);

  card.append(el('div', { className: 'row between' },
    el('button', { className: 'btn', textContent: '↺ Start over', onclick: () => { argument = ''; renderStart(); } }),
    el('span', { className: 'muted', textContent: 'You’re looking for what holds up, not hunting for flaws.' }),
  ));
  app.append(card);
}

// ---------- 3. the positive-first virtue checklist ----------
function renderChecklist(familyId) {
  clear();
  // Collect every tell for the family's fallacies, de-duplicated by question id (a question shared
  // across siblings appears once). Each row is a virtue the user marks ✓ / ✗ / skip.
  const seen = new Set();
  const rows = [];
  for (const fid of DATA.families[familyId]) {
    for (const t of (DATA.tells[fid] || [])) {
      if (seen.has(t.qid)) continue;
      seen.add(t.qid);
      rows.push({ qid: t.qid, text: t.text });
    }
  }
  const choice = {};   // qid -> 'has' | 'lacks'  (absent = skip)

  const card = el('section', { className: 'card' });
  if (argument) card.append(el('blockquote', { className: 'recall', textContent: argument }));
  card.append(el('p', { className: 'kicker', textContent: familyName(familyId) }));
  card.append(el('h2', { textContent: 'Which of these does the argument do?' }));
  card.append(el('p', { className: 'muted',
    textContent: 'Tick ✓ for what it does well, ✗ for what it falls short on, and leave the rest blank. We start by assuming it holds up.' }));

  const list = el('div', { className: 'checklist' });
  for (const r of rows) {
    const has = el('button', { className: 'tri tri-has', textContent: '✓', title: 'It does this' });
    const lacks = el('button', { className: 'tri tri-lacks', textContent: '✗', title: 'It falls short here' });
    const row = el('div', { className: 'check-row' },
      el('span', { className: 'check-text', textContent: r.text }),
      el('span', { className: 'tri-group' }, has, lacks),
    );
    const refresh = () => {
      has.classList.toggle('on', choice[r.qid] === 'has');
      lacks.classList.toggle('on', choice[r.qid] === 'lacks');
    };
    has.onclick = () => { choice[r.qid] = choice[r.qid] === 'has' ? undefined : 'has'; refresh(); };
    lacks.onclick = () => { choice[r.qid] = choice[r.qid] === 'lacks' ? undefined : 'lacks'; refresh(); };
    list.append(row);
  }
  card.append(list);

  const see = el('button', { className: 'btn btn-primary', textContent: 'See what holds up →' });
  see.onclick = () => {
    const affirmed = Object.keys(choice).filter((q) => choice[q] === 'has');
    const denied = Object.keys(choice).filter((q) => choice[q] === 'lacks');
    renderVerdict(scoreChecklist(DATA, { familyId, affirmed, denied }), familyId);
  };
  card.append(el('div', { className: 'row between' },
    el('button', { className: 'btn', textContent: '← Pick a different focus', onclick: renderFamilyPick }),
    see,
  ));
  app.append(card);
}

// ---------- 4. verdicts (tentative + teaching) ----------
function renderVerdict(result, familyId) {
  clear();
  switch (result.kind) {
    case 'accuse': return renderAccuse(result);
    case 'inconclusive_lean': return renderInconclusive(result);
    case 'cynic_valid':
    default: return renderValid(familyId);
  }
}

function renderAccuse(result) {
  const f = DATA.fallacies[result.fallacy];
  const yes = el('button', { className: 'btn btn-primary', textContent: 'Yes — that fits' });
  const no = el('button', { className: 'btn', textContent: 'No — that’s not it' });
  const card = el('section', { className: 'card verdict-accuse' },
    el('p', { className: 'kicker', textContent: 'A tentative thought' }),
    el('p', { className: 'verdict-title', textContent: `This might be leaning toward ${f.name}.` }),
    el('p', { className: 'muted', textContent: 'It’s only a suspicion — you’re the judge. Here’s what that means:' }),
    el('div', { className: 'teaching' },
      el('span', { className: 'name', textContent: f.name + '. ' }),
      document.createTextNode(f.teaching),
      el('p', { className: 'check', textContent: f.confirm_check }),
    ),
    el('div', { className: 'answers' }, yes, no),
  );
  app.append(card);
  yes.onclick = () => renderConfirmed(f);
  no.onclick = () => renderCynic('rejected', f);
}

function renderConfirmed(f) {
  clear();
  app.append(el('section', { className: 'card verdict-accuse' },
    el('p', { className: 'kicker', textContent: 'You made the call' }),
    el('p', { className: 'verdict-title', textContent: `Looks like a ${f.name}.` }),
    el('p', { textContent:
      'You confirmed it — the argument seems to rest on this rather than on its own merits. ' +
      'Naming a fallacy isn’t a “gotcha,” though: the underlying point might still be worth ' +
      'engaging once it’s argued fairly.' }),
    el('p', { className: 'muted', textContent: 'Spotting the flaw is the easy part. Steelmanning what’s left is the generous one.' }),
    restartRow(),
  ));
}

function renderInconclusive(result) {
  clear();
  const f = result.leanFallacy ? DATA.fallacies[result.leanFallacy] : null;
  const lean = f
    ? `There might be something here — possibly a ${f.name} — but not enough to call it.`
    : 'There might be something here, but not enough to call it.';
  app.append(el('section', { className: 'card verdict-cynic' },
    el('p', { className: 'kicker', textContent: 'The verdict' }),
    el('p', { className: 'verdict-title', textContent: 'Inconclusive — and that’s allowed.' }),
    el('p', { textContent: lean + ' We’d rather say “not sure” than accuse an argument that might be fine.' }),
    el('p', { className: 'muted', textContent: 'Trust your judgment. If it still feels off, the fair move is to ask the other person to spell out their reasoning.' }),
    restartRow(),
  ));
}

function renderValid(familyId) {
  clear();
  const body = familyId
    ? 'You looked closely and it holds up — what you checked came out in the argument’s favor. No clear fallacy here.'
    : 'You read it fairly and nothing rose above the benefit of the doubt. There’s no clear fallacy — the argument holds up well enough.';
  app.append(el('section', { className: 'card verdict-valid' },
    el('p', { className: 'kicker', textContent: 'The verdict' }),
    el('p', { className: 'verdict-title', textContent: 'The argument holds up.' }),
    el('p', { textContent: body }),
    el('p', { className: 'muted', textContent: 'That’s a real result — most arguments aren’t fallacies. Disagreeing is fine; just engage the actual point.' }),
    restartRow(),
  ));
}

function renderCynic(why, rejectedFallacy) {
  clear();
  const body = why === 'rejected'
    ? `You looked at the suspicion of ${rejectedFallacy.name} and decided it didn’t fit — good. ` +
      `We won’t reach for a second-best accusation. The argument may simply be sound, and you may ` +
      `just be a little skeptical. That’s an honest place to land.`
    : 'There may be no fallacy here at all — you might just be feeling skeptical, and that’s okay.';
  app.append(el('section', { className: 'card verdict-cynic' },
    el('p', { className: 'kicker', textContent: 'The verdict' }),
    el('p', { className: 'verdict-title', textContent: '…or maybe you’re just being a little cynical.' }),
    el('p', { textContent: body }),
    el('p', { className: 'muted', textContent: 'Skepticism is healthy. Treating every argument as guilty is the thing worth resisting.' }),
    restartRow(),
  ));
}

function restartRow() {
  return el('div', { className: 'row end' },
    el('button', { className: 'btn btn-primary', textContent: 'Examine another →',
      onclick: () => { argument = ''; renderStart(); } }),
  );
}

function renderLoadError(err) {
  clear();
  app.append(el('section', { className: 'card' },
    el('p', { className: 'kicker', textContent: 'Couldn’t start' }),
    el('h1', { textContent: 'Fallacynator' }),
    el('p', { className: 'error', textContent: err.message || String(err) }),
  ));
}
