// Coverage test — the scale safety net. Run: node tests/coverage.test.js
//
// The calibration test only checks fallacies that have a hand-written fixture, so a fallacy added
// without one (or one that quietly became unreachable) passes green while being dead on arrival.
// This test checks EVERY fallacy in the catalog automatically: it synthesizes the honest answer
// path a careful reader would give to a textbook instance of that fallacy (incriminate that
// fallacy's questions, exonerate everything else), runs it through real question-selection across
// several seeds, and asserts the fallacy actually gets caught often enough.
//
// This is what makes "routinely add 100+ fallacies" safe: a new fallacy that can't be reached or
// can't clear the gate turns the build RED instead of silently never firing.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadData, newSession, answer, status } from '../src/engine.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const fallaciesJSON = read('data/fallacies.json');
const questionsJSON = read('data/questions.json');
const data = loadData(fallaciesJSON, questionsJSON);
const QUESTIONS = questionsJSON.questions;

const SEEDS = [1, 7, 42, 1337, 99999, 123, 777, 2024];
const CATCH_FLOOR = 0.5;   // each fallacy must be caught on ≥ this fraction of seeds
const ENTRY_MIN = 2;       // structural rule: ≥2 entry-pool questions (what makes a fallacy reach the gate)

// Honest answer path for a textbook instance of `target`: a question that points at `target`
// (its yes-weight > 1) is answered "yes"; every other question is answered "no" (the argument is
// ONLY this fallacy — clean on every other dimension). This is exactly how a fair reader of a
// clear example would answer, and it's derived from the weights so it needs no hand-written fixture.
function honestPath(target) {
  const m = {};
  for (const q of QUESTIONS) {
    const inc = q.lr[target] && q.lr[target].yes > 1;
    m[q.id] = inc ? 'yes' : 'no';
  }
  return m;
}

function catchCount(target) {
  const path = honestPath(target);
  let caught = 0;
  for (const seed of SEEDS) {
    const s = newSession(data, seed);
    let guard = 0, verdict = '';
    while (guard++ < 40) {
      const st = status(s);
      if (st.stop) { verdict = st.kind === 'accuse' ? st.fallacy : st.kind; break; }
      const qid = st.nextQuestion.id;
      answer(s, qid, path[qid] ?? 'unsure');
    }
    if (verdict === target) caught++;
  }
  return caught;
}

let passed = 0;
const ok = (m) => { passed++; console.log(`  ✓ ${m}`); };
const failures = [];

// ---- structural: every fallacy has enough entry-pool coverage to be reachable ----
for (const f of fallaciesJSON.fallacies) {
  const entryQs = QUESTIONS.filter((q) => (q.tags || []).includes('entry') && (f.id in q.lr)).length;
  if (entryQs < ENTRY_MIN) {
    failures.push(`ENTRY: ${f.id} has only ${entryQs} entry-pool question(s); needs ≥ ${ENTRY_MIN} to surface reliably (add it to broad "entry" questions — see guidance/ADDING-FALLACIES.md)`);
  }
}

// ---- behavioral: every fallacy actually catches on a textbook instance ----
console.log(`Per-fallacy catch (honest path, ${SEEDS.length} seeds, floor ${CATCH_FLOOR * 100}%):`);
const rows = [];
for (const f of fallaciesJSON.fallacies) {
  const c = catchCount(f.id);
  const rate = c / SEEDS.length;
  rows.push(`  ${rate >= CATCH_FLOOR ? '✓' : '✗'} ${f.id.padEnd(28)} ${c}/${SEEDS.length}`);
  if (rate < CATCH_FLOOR) {
    failures.push(`CATCH: ${f.id} caught only ${c}/${SEEDS.length} (< ${CATCH_FLOOR * 100}%) on its own textbook instance — likely too few dedicated/entry questions or weights too weak`);
  }
}
console.log(rows.join('\n'));

if (failures.length) {
  console.log(`\n${failures.length} problem(s):`);
  for (const f of failures) console.log('  ✗ ' + f);
  assert.fail(`coverage: ${failures.length} fallacy/ies are not reliably reachable or catchable`);
}
ok(`all ${fallaciesJSON.fallacies.length} fallacies have ≥${ENTRY_MIN} entry questions and catch ≥${CATCH_FLOOR * 100}% on their textbook instance`);

console.log(`\n${passed} check(s) passed.`);
