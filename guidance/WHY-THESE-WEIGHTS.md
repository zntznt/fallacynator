# Why the weights are what they are

The `lr` (likelihood-ratio) weights in `data/questions.json` are the app's entire "knowledge" — the
numbers that turn your answers into a verdict. This doc explains **why those specific numbers**, so
you can defend any one of them and set new ones correctly.

Short version: **the weights are not per-fallacy fine-tuning.** There is no story for "why is this
fallacy 4.5 and that one 3.8" — because nobody tuned them that finely. Instead there's a tiny
**vocabulary of standard values, assigned by the *role* a question plays**, chosen so the math
clears the accusation gate exactly when it should. The rationale is about the roles, not the
fallacies.

For how the weights are *used* (the Bayesian update and the gate), see
[HOW-IT-DECIDES.md](HOW-IT-DECIDES.md). For the schema and hard rules, see
[ENGINE-SPEC.md](ENGINE-SPEC.md). For the step-by-step recipe when adding a fallacy, see
[ADDING-FALLACIES.md](ADDING-FALLACIES.md). This doc is the *why* underneath that recipe.

---

## What a weight means

Each question's `lr` table gives a multiplier per hypothesis, for each answer:

```json
"q_responds_to_claim_or_person": {
  "lr": {
    "ad_hominem": { "yes": 4.5, "no": 0.3 },
    "VALID":      { "yes": 0.6, "no": 1.4 }
  }
}
```

- `yes: 4.5` → answering "yes" multiplies that fallacy's running odds by 4.5.
- `no: 0.3`  → answering "no" multiplies them by 0.3 (knocks them down to ~a third).
- A value **> 1** is evidence *for* the hypothesis; **< 1** is evidence *against*; **1.0** is "this
  answer says nothing about this hypothesis."

The weights are *relative*, not probabilities — only their ratios matter, and the engine renormalizes
after every answer.

---

## The standard vocabulary (what the numbers actually are)

A survey of all 155 tells shows the weights cluster on a handful of values. They aren't arbitrary —
each value is a **role**:

### YES weights (evidence the fallacy is present)

| Value | Role | Used for |
|---|---|---|
| **4.5** | **Sole owner** — this question's "yes" points at *this fallacy and basically no other* | the default for a fallacy's 2–4 distinctive tells (139 of the tells use it) |
| **4.0** | **Strong but shared** — points strongly here, but a sibling fallacy shares the signal | a tell two related fallacies both lean on (18 tells) |
| **2.0–2.6** | **Weak / contributory** — mild evidence, not enough alone | broad routing questions, secondary tells |
| **1.6–1.8** | **Faint** — nudges, doesn't decide | rare; a question that barely distinguishes |

### NO weights (evidence the fallacy is absent — the virtue is present)

| Value | Role |
|---|---|
| **0.3** | The standard "denying this virtue's absence counts clearly against the fallacy" — 141 of the tells use it |
| 0.35–0.5 | Slightly softer, for shared/weaker tells |

So in practice the recipe for a fallacy's distinctive tell is **`{ "yes": 4.5, "no": 0.3 }`**, and
the rationale below is really "why 4.5 and 0.3."

---

## Why 4.5 / 0.3 — the math, not a vibe

The values are reverse-engineered from the **accusation gate**, so that the right number of denials
produces the right verdict. In the live checklist, each fallacy is scored in its own isolated
two-way world (just *this fallacy vs. VALID*), and the gate to accuse is
`CHECKLIST_RATIO_VALID = 0.12` (the fallacy's share must reach 0.12× of VALID's).

The design target is deliberately:

> **One denied virtue should NOT convict. Two should.**

One missing virtue is a fair-minded "hmm, but maybe"; two independent missing virtues of the *same*
fallacy is a real pattern. The weights are the values that make exactly that true. Measured across
the catalog with the standard `4.5 / 0.3`:

| | f / VALID ratio | vs. gate (0.12) | verdict |
|---|---|---|---|
| **1 virtue denied** | ~0.04 – 0.06 | **below** | holds up ✓ |
| **2 virtues denied** | ~0.18 – 0.28 | **above** | accuse ✓ |

(Verified live for ad_hominem, strawman, tu_quoque, appeal_to_authority, appeal_to_emotion,
appeal_to_nature — the pattern is consistent. Re-run the check in
[ADDING-FALLACIES.md](ADDING-FALLACIES.md) if you change the gate or the weights.)

Read the other way: **the gate (0.12) was set first** — at the midpoint of the measured 1-denial
(~0.06) and 2-denial (~0.18) window — and **4.5 / 0.3 are the weights that land cleanly on either
side of it with comfortable margin.** Change one and you must re-check the other.

### Why not bigger weights?
Bigger `yes` (say 9) would let a *single* denial convict — losing the "one isn't enough" charity, and
risking false accusations on a sound argument the user happens to mark one ✗ on. The engine also
clamps per-cell likelihoods (`L_MIN`/`L_MAX`) and the max ratio within a row (`MAX_LR_RATIO = 8`)
precisely so no single answer can be near-decisive. 4.5 sits comfortably inside that clamp.

### Why not smaller?
Smaller `yes` (say 2.5) and even two denials wouldn't out-rise the 60% innocence prior — real
fallacies would never clear the gate, and the app would call everything "fine." We saw exactly this
when correlation-damping (`EVIDENCE_DAMP`) was below 1.0; it's documented in `CONFIG`.

---

## The two rules that keep weights honest

1. **Distinctiveness** *(a convention, enforced by the gate + tests — not a load-time check).*
   A fallacy's **sole-owner (4.5) tells** should out-weight any sibling that shares the question, so
   the **runner-up gate** (`RATIO_RUNNERUP`) can clear and the app names *which* fallacy. If two
   fallacies tie at 4.5 on the same question, the engine can't separate them and you'll get "not
   sure" instead of a named verdict — that's the failure mode this convention avoids, and it's why
   "sole owner = 4.5, shared sibling = 4.0".
   *Caveat, so you don't overclaim it:* this is **not** asserted by `validateBank`. The deliberate
   exceptions are the **broad routing questions** (`q_evidence_or_assertion`,
   `q_conclusion_matches_support`) — they sit in the weak ~2.6 tier and are *intentionally shared/tied*
   across several fallacies, because their job is to route to a family, not to single out a member.
   Distinctiveness only needs to hold for the 4.5 owner tells, and it's the runner-up gate and the
   calibration test — not a schema rule — that actually keep it honest.

2. **No false accusations, ever** *(this one IS enforced).* Whatever weights you pick,
   `tests/calibration.test.js` asserts that **zero** sound fixtures get accused. If a new weight
   causes a false accusation, the weight is wrong — full stop. This is the sacred line; the weights
   serve it, not the other way around.

   *(What `validateBank` does check at load time, related to weights: G2 — an incriminating `yes`
   must cost VALID (`lr.VALID.yes ≤ 1.0`); G4 — the max/min ratio within one answer row can't exceed
   `MAX_LR_RATIO` (8); plus prior-cap and PRIOR_VALID ≥ 0.55 guards. Distinctiveness is not among
   them.)*

---

## How to set weights for a NEW fallacy (the why behind the recipe)

1. Give it **2–4 questions only it owns**, each `{ "yes": 4.5, "no": 0.3 }`. Two so that the
   "two denials convict" target is reachable; owned so no sibling ties its 4.5 (keeping it tellable
   apart at the runner-up gate).
2. If a question is genuinely shared with a sibling, the **less-specific** fallacy drops to `4.0` so
   the owner stays strictly on top.
3. Use weaker values (2.x) only for broad routing questions that *help find the family* but
   shouldn't *convict* on their own.
4. Run the calibration + coverage tests. Green = your weights clear the gate for real cases and never
   fire on sound ones. That test result **is** the justification for the numbers — they're correct
   because they produce correct verdicts, not because of any individual number's pedigree.

---

## "Doesn't this make ties common?"

A fair worry: if many fallacies share the same canonical weights, won't lots of cases end with two
fallacies equally probable? Measured against the live catalog, the answer is **no for the clean case,
and a designed-for outcome in the messy one:**

- **Within a family, tells don't overlap.** Each sibling fallacy owns its *own* distinct questions
  (checked: zero shared tells in the families surveyed). So when a user denies one fallacy's tells,
  only that fallacy's isolated score moves — it wins cleanly. Denying any fallacy's own two tells and
  asking "does it dominate its family runner-up by 2.5×?" → **73 / 73 clean wins.** No tie.

- **When the argument genuinely spans two fallacies, the engine refuses to guess.** If a user denies
  a tell of fallacy A *and* a tell of fallacy B, neither clears the runner-up gate, so the verdict is
  **`inconclusive_lean`** — "might be B, but not enough to be sure," naming the leader without
  accusing. A real tie produces an honest non-committal answer, not a coin-flip. That's the goodwill
  thesis applied to the app itself: epistemic humility when the evidence is ambiguous.

- **The one genuine failure — two fallacies tied at the 4.5 owner tier on the same question — does
  not exist today** (every strong-tier question has a single clear owner) and is now caught at load
  time by a **G8b warning** in `validateBank`, so it can't silently creep in as fallacies are added.

So ties aren't a flaw the system stumbles into — the only "tie" that reaches the user is the
*legitimate* one (a genuinely ambiguous argument), and it has its own correct verdict.

## One-paragraph version

> The weights aren't tuned per fallacy. There's a small vocabulary — 4.5 for a fallacy's own
> distinctive tells, 4.0 for ones it shares, 0.3 for denying a virtue — chosen so that **one missing
> virtue holds up and two convict**, landing on either side of a gate that was set at the midpoint of
> those two outcomes. Distinctiveness (the owner out-weighs sharers) keeps fallacies tellable apart,
> and the zero-false-accusation test is the final arbiter: weights are right because they produce
> right verdicts, verified continuously — not because any single number is special.
