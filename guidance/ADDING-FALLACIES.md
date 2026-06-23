# Adding a fallacy (or a question)

**You do not touch any code.** Fallacynator's engine reads everything from `data/`. Adding a
fallacy is append-only JSON. The engine validates your edits at load and the tests will fail
loudly if you break a goodwill guardrail — that's the safety net, lean on it.

Read [DESIGN-PRINCIPLES.md](DESIGN-PRINCIPLES.md) first if you haven't. The one rule that
matters: **this app gives arguments the benefit of the doubt.** Every question must be able to
vote *for* the argument being sound, not only against it. A question that can only incriminate
will refuse to load.

---

## The 4 steps

### 1. Add the fallacy to `data/fallacies.json`

Append one object to the `fallacies` array:

```json
{
  "id": "red_herring",
  "name": "Red Herring",
  "base_rate": 1.0,
  "short": "Diverting attention to an unrelated point instead of addressing the issue.",
  "teaching": "A red herring changes the subject to something that feels relevant but isn't, leaving the original point unanswered. Bringing in genuinely related context is fine — it's only a red herring when the detour replaces the response rather than supporting it.",
  "confirm_check": "Does the response shift to a different issue and leave the original point unanswered, rather than genuinely bearing on it?"
}
```

| field | rule |
|---|---|
| `id` | lowercase `^[a-z][a-z0-9_]*$`, unique, never `"VALID"` |
| `name` | display name |
| `base_rate` | how common it is (1.0 typical; ~1.5 very common; ~0.8 rarer). Keep it modest — see the cap note below. |
| `short` | ≤ 120 chars, one plain line |
| `teaching` | 1–3 plain sentences. **Always say when it is *not* a fallacy** (the charitable caveat). No jargon. |
| `confirm_check` | the yes-confirms question the *user* answers at the end. Required. |

> **base_rate cap:** with the strong validity prior, every fallacy's starting probability must
> stay ≤ 0.15. With a dozen-ish fallacies near `base_rate: 1.0` you're nowhere near it. If you
> add many fallacies with high base_rates the loader will reject the bank (guardrail G7) — lower
> them.

### 2. Add at least **two** questions to `data/questions.json` that detect it

Why two: the engine refuses to accuse on a single answer (it would beat the validity prior on
flimsy evidence). It takes ~two consistent incriminating answers to even *tentatively* suspect a
fallacy, so every fallacy needs ≥ 2 questions pointing at it.

```json
{
  "id": "q_detour_or_response",
  "text": "Does the response address the point that was raised, or shift attention to a different issue?",
  "tags": [],
  "lr": {
    "red_herring": { "yes": 4.5, "no": 0.3 },
    "VALID":       { "yes": 0.6, "no": 1.4 }
  }
}
```

**The `lr` table is the whole game.** It says how strongly each answer points at each hypothesis.
You only write `yes` and `no` weights (multiplicative, centered on 1.0). The engine derives the
charitable `maybe`/`unsure` behavior for you — never hand-write those.

The reliable pattern for "a question that detects fallacy F":

```json
"F":     { "yes": 4.5, "no": 0.3 },   // the incriminating reading points hard at F
"VALID": { "yes": 0.6, "no": 1.4 }    // ...and that same reading costs VALID a little,
                                       //    while the exonerating reading rewards VALID
```

- Incriminating weight (the bad reading) on F: `yes` between **2 and 6**. Stronger = more
  diagnostic. (Anything above 3 is clamped to 3 internally — authoring 4.5 just means "as strong
  as it gets.")
- Exonerating weight on F: `no` between **0.3 and 0.7**.
- `VALID` row: incriminating side `yes` ≤ 1.0 (usually ~0.6), exonerating side `no` ≥ 1.0
  (usually ~1.4). This is what lets the argument earn innocence.

A question can point at **several related fallacies** — list them all in `lr` (see
`q_conclusion_matches_support`, which informs circular_reasoning, false_cause, and
hasty_generalization at once). That gives the question-picker more to work with.

### 2b. Give the fallacy **≥ 2 entry-pool questions** — this is the one that bites

This is the rule learned the hard way, and `tests/coverage.test.js` enforces it. **A fallacy that
isn't in at least two `["entry"]`-tagged questions will validate, load, and pass the calibration
test — and then never actually get caught.** Here's why:

The engine picks each question by information gain. Broad questions (touching many fallacies) always
out-score narrow ones, so a fallacy whose *only* foothold is a narrow question never gets asked
early enough to rise above the validity prior — it's uncatchable no matter how guilty the argument.
Every fallacy that catches reliably (ad_hominem, tu_quoque, argument_from_incredulity) has **two or
more entry-pool presences**; every one that didn't, had one.

Two honest ways to get a second entry presence:
1. **Add the fallacy to an existing broad entry question** where a "yes" genuinely indicates it.
   (e.g. `argument_from_incredulity` was added to `q_evidence_or_assertion` — "rests on something
   other than reasons" honestly covers "I can't imagine how".) Best when a real fit exists.
2. **Tag one of the fallacy's own dedicated questions `["entry"]`.** Always honest (a dedicated
   question is a fair probe by definition) and the simplest lever. Use this freely.

Keep the entry pool from ballooning (≤ ~16 entry questions) so the opening phase stays focused.

> **Note for large catalogs (~40+ fallacies):** the entry-pool approach has a ceiling — see
> [ARCHITECTURE.md](ARCHITECTURE.md) "Scaling to a large catalog". At that size, switch to
> family-based routing. Below it, ≥2 entry questions per fallacy is enough.

### 3. Add a calibration fixture to `data/fixtures.json`

Add **one fallacious example** (clearly committing your new fallacy, with the honest answer path
a careful reader would give) and ideally **one sound near-miss** (an argument that superficially
resembles it but is actually fine — e.g. a *relevant* aside that isn't a red herring). This is
how you prove the new fallacy gets caught *and* doesn't cause false accusations.

```json
{ "id": "rh_clear", "label": "red_herring",
  "argument": "Reporter: the budget has a $2M shortfall. Mayor: what about all the great parks we built last year?",
  "answers": { "q_detour_or_response": "no", "q_conclusion_matches_support": "no" },
  "default": "unsure" },
{ "id": "rh_nearmiss", "label": "VALID",
  "argument": "The budget has a shortfall, but note the shortfall is one-time and the parks generate recurring revenue that closes it — here are the figures.",
  "answers": { "q_detour_or_response": "yes", "q_conclusion_matches_support": "yes" },
  "default": "no" }
```

### 4. Run the tests — all three must pass

```bash
node tests/engine.test.js        # engine math (independent of your data)
node tests/coverage.test.js      # every fallacy is reachable; aggregate catch above floor
node tests/calibration.test.js   # hand-written fixtures: 0 false accusations + ≥60% catch
```

`coverage.test.js` is the one that protects you when adding routinely. It auto-derives a textbook
answer path for **every** fallacy from its weights (no fixture needed) and checks two tiers:

- **Tier 1 (hard) — structural reachability.** Every fallacy must have ≥2 entry-pool questions and
  ≥2 dedicated (incriminating) questions. A new fallacy you forgot to wire in fails the build here.
  Fixes: **"ENTRY: X has only 1…"** → do §2b; **"DEDICATED: X has only 1…"** → add a question.
- **Tier 2 (soft→hard) — catch behavior.** It reports each fallacy's catch rate and fails if a
  **new** fallacy catches weakly, a **previously-working** one regresses, or the **aggregate** mean
  drops below `AGGREGATE_FLOOR`. A short `KNOWN_WEAK` allowlist grandfathers today's stubborn
  fallacies (see ARCHITECTURE.md "Known-weak"). **When you add a fallacy, get it catching ≥50% — do
  NOT add it to `KNOWN_WEAK` to dodge the test.** The allowlist only ever shrinks.

If `calibration.test.js` reports a false accusation on a sound fixture, your `lr` weights are too
aggressive (or a VALID row is missing its pro-innocence pull). Dial back. The 0-false-accusation
line is sacred — never relax it to make a catch pass.

---

## What the loader rejects (so you can't ship a gotcha)

`validateBank()` (in `src/engine.js`) throws — the app won't start — if any of these fail. Full
list in [ENGINE-SPEC.md §4.3](ENGINE-SPEC.md). The ones you'll actually hit:

- **G1** — a question's `lr.VALID.no` must be ≥ 1.0 *and* greater than the lowest fallacy `.no` in
  that question. Translation: some answer has to be able to raise VALID. A question that can only
  incriminate is illegal.
- **G2** — an incriminating `yes` for a fallacy must pair with `VALID.yes ≤ 1.0`; an exonerating
  `no` must pair with `VALID.no ≥ 1.0`. Incrimination costs VALID; exoneration rewards it.
- **missing `confirm_check`** — every fallacy needs one; it's what keeps verdicts tentative.
- **G7** — priors over the cap (lower your base_rates).

These aren't style rules. They are the mechanical guarantee that the app stays charitable no
matter who edits the data.
