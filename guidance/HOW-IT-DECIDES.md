# How Steelman decides what is — and isn't — a fallacy

A plain-English walkthrough of the decision, for explaining the app to someone (or to yourself).
For the formal math and config, see [ENGINE-SPEC.md](ENGINE-SPEC.md). The whole engine is
`src/engine.js`; everything below points at real functions and real numbers from the data.

---

## The one idea to hold onto

**The app never reads your argument. It scores your answers.**

There is no language model, no text analysis, no "AI" looking at the words. The app shows you
plain questions about the argument; *you* answer them; and a small, fixed piece of arithmetic turns
your answers into a verdict. Every number it uses was written by hand and lives in the data files.
That's why it's explainable: the decision is a transparent calculation, not a black box.

So "how does it know it's a fallacy?" really means two things:
1. **How does each of your answers move the needle?** (the belief update)
2. **When does the needle move far enough to say "fallacy"?** (the gate)

---

## Step 0 — It starts out trusting the argument

Before you answer anything, the app assigns a **prior**: how likely each verdict is, with no
evidence yet. (`newSession` in the engine.)

- **VALID (it's fine): 60%** — the strong "innocent until proven otherwise" prior (`PRIOR_VALID`).
- The remaining 40% is split across *all the fallacies*, weighted by how common each one is.

This is the goodwill thesis, encoded as a number. An argument starts mostly assumed-sound, and your
answers have to *earn* a fallacy verdict against that head start.

---

## Step 1 — Each question carries hand-written weights

Every question in `data/questions.json` has a likelihood table (`lr`) saying how much a given answer
points toward each verdict. A real example — the "is it attacking the person?" question:

```json
"q_responds_to_claim_or_person": {
  "lr": {
    "ad_hominem": { "yes": 4.5, "no": 0.3 },
    "tu_quoque":  { "yes": 2.0, "no": 0.6 },
    "VALID":      { "yes": 0.6, "no": 1.4 }
  }
}
```

Read it like this:

- Answer **"yes, it attacks the person"** → multiply ad_hominem's odds by **4.5**, VALID's by only
  **0.6**. Strong evidence *for* the fallacy, mild evidence *against* "it's fine."
- Answer **"no, it engages the idea"** → ad_hominem's odds ×**0.3** (knocked down), VALID's ×**1.4**
  (boosted). Evidence the argument is healthy.

A number **> 1** pushes toward that verdict; **< 1** pushes away. Those weights are the whole
"knowledge" of the app — there are 73 fallacies, each with a handful of these questions ("tells").

---

## Step 2 — Answers multiply together (Bayes)

When you answer, the engine multiplies each verdict's running odds by the matching weight
(`update`), then renumbers everything back to percentages that sum to 100 (`normalizeLog` — it does
this in log-space so many small multiplications stay numerically stable). Two answers pointing the
same way compound; answers pointing opposite ways partly cancel.

A few guardrails keep any single answer from being overwhelming (all in `CONFIG`):

- **Likelihood clamps** (`L_MIN`/`L_MAX`, `MAX_LR_RATIO`) — no single answer can be near-certain.
- **A posterior floor** (`EPS`) — no verdict is ever driven to exactly zero, so evidence can always
  pull it back. Nothing is permanently ruled out.
- **A per-fallacy prior cap** (`PRIOR_FALLACY_CAP`) — no one fallacy can start with too much
  suspicion, even if it's common.

---

## Step 3 — The live path: pick a family, then confirm virtues

The app you actually use is the **checklist** (`scoreChecklist`), not a 20-questions interview. It
works in three moves:

1. **You pick a family** of related problems ("Against the person", "Forces a narrow choice", …).
   That narrows the contest from 73 fallacies to the 3–4 in that family, so "it's fine" only has to
   beat a few near-neighbors, not a crowd. (A typed argument also runs a keyword scan to *suggest* a
   family — but it only suggests; it never decides. See `suggestFamily`.)

2. **You answer each "Does it…?" question** with 👍 (yes, it does this good thing), 👎 (no, it
   doesn't), or "doesn't apply"/skip (no signal). Each question is framed as a *virtue a healthy
   argument has*, so:
   - 👍 = "it does the good thing" = evidence the argument is **fine**.
   - 👎 = "it doesn't" = evidence of the **fallacy**.

3. **Each fallacy is scored in its own private two-way contest** — just *that fallacy vs. VALID*,
   using only *its own* questions (`scoreFallacy`). This is the important subtlety: if you honestly
   say an argument *didn't* strawman and *didn't* tu-quoque, that shouldn't make a real ad-hominem
   look innocent. Scoring each fallacy in isolation stops one fallacy's "all good here" answers from
   washing out another fallacy's real failures. (This was a bug we fixed — see the
   [philosopher panel report](PHILOSOPHER-PANEL-REPORT.md), finding C-1.)

---

## Step 4 — The gate: when does it actually say "fallacy"?

After scoring, the leading fallacy has to clear **three relative tests** to be accused. They're
*ratios*, not fixed percentages, on purpose: as we add fallacies the prior gets split thinner, so an
absolute "must hit 50%" target would become unreachable — but "decisively beat innocence" stays
meaningful at any catalog size.

A fallacy is **accused** only when:

1. **It beats innocence.** Its own score must clear `CHECKLIST_RATIO_VALID × P(VALID)` in its
   isolated contest — i.e. its tells were denied enough that the fallacy now outweighs "it's fine."
   *(One denied tell isn't enough; it takes about two.)*
2. **We know which one.** It must dominate the **runner-up fallacy** by `RATIO_RUNNERUP` (2.5×). If
   two different fallacies are both plausible, we don't pin a label — we lean.
3. *(In the sequential flow, a small absolute floor `MIN_ACCUSE_MASS` also applies, so a fallacy
   leading a near-empty field on thin evidence can't accuse.)*

If it beats innocence but **not** the runner-up, or if failures are spread across **two or more
distinct fallacies**, the verdict is an honest **lean** ("might be X, not sure"), never "sound." And
if nothing beats innocence, the argument **holds up**.

### The four outcomes you can get

| Verdict | What it means | How it's reached |
|---|---|---|
| **Holds up (earned)** | You confirmed real virtues and nothing failed enough | No fallacy beat innocence; you affirmed ≥2 virtues (`valid_earned`) |
| **Holds up (checked)** | You looked, nothing rose above the doubt | No fallacy beat innocence; few/no affirmations (`cynic_valid`) |
| **A weak spot — looks like X** | One fallacy clearly beat both innocence and the runner-up | All three gates passed (`accuse`) |
| **Not enough to be sure** | Something's there, but no single fallacy dominates | Beat innocence but not the runner-up, or 2+ distinct fallacies implicated (`inconclusive_lean`) |

---

## Why a fallacy can fail to "trip" — and that's correct

People expect "I marked a lot of red, why isn't it a fallacy?" The answer: marking many 👎 spread
across *different* fallacies doesn't make any *single* one dominate — so the app honestly says "not
sure," not "sound" and not a confident accusation. Suspicion has to **concentrate** on one fallacy
to name it. This is the same principle as a court: lots of vague doubt isn't a conviction.

And the reverse is the sacred rule: **the app will never accuse a sound argument.** The whole gate is
tuned so that genuinely-fine arguments peak far below the accusation line (verified continuously by
`tests/calibration.test.js`, which asserts **zero false accusations**). When in doubt, it holds up or
leans — it does not pin a label.

---

## One-paragraph version (for explaining out loud)

> It starts by assuming the argument is fine (60%). It asks you plain yes/no questions about the
> argument; each answer nudges the odds using weights we wrote by hand. It scores each possible
> fallacy on its own, just against "it's fine." It only says "fallacy" when one fallacy clearly
> beats both "it's fine" *and* every other fallacy — otherwise it says "holds up" or "not sure." It
> never reads your text and it never accuses a sound argument.
