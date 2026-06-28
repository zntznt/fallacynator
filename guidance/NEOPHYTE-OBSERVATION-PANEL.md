# Neophyte observation panel: what absolute newcomers experienced

A panel of 8 diverse absolute-newcomers (people who have never heard the term "logical fallacy"
and use plain everyday language) was run through a moderated think-aloud walkthrough of the real
app. They were asked to report their EXPERIENCE, not to suggest fixes. Each transcript was then
adversarially audited for realism (genuine newbie confusion vs. strawman); all 8 passed. The
diagnosis and the fixes below are ours, drawn from the raw observations.

## What they experienced (the raw signal)

Three root faults explained almost everything the panel hit:

1. **The app never established what it is or what to feed it.** All 8 read "argument" as a fight or
   quarrel and pasted a personal grievance, then waited to be told they were right. The old
   placeholder ("She failed a class in college") was read as "type YOUR situation here," so they
   overwrote it with their own. "Fallacy" appeared only at the very end. "Steelman" read as Iron Man
   or a gym app. Two left never knowing what the app was for.

2. **The taxonomy was exposed raw to people who do not have it.** 7 of 8 said the buckets were "the
   same thing said in fancy ways." Specific conflations: "It misses the point" vs "It points at the
   wrong thing"; "It assumes too much" vs "It claims more than it shows"; and on the second level,
   "Assumes what it should establish" vs "Assumes what it's proving" ("literally the same sentence").
   Five "Other ___" catch-all families could not be mapped to anything. People picked by
   keyword-matching, not understanding, and sometimes mis-routed.

3. **The answer polarity was unanchored.** 6 of 8 could not tell whether 👍/"yes" meant the argument
   was good, on their side, or "caught the bad thing." The checklist asks about GOOD things a fair
   argument does, while they arrived hunting for what is BAD, so a bare "yes" floated free. They were
   answering on a coin flip, which quietly corrupts the verdict.

Secondary patterns: the narrow-down screen read as "the same question again / I tapped wrong" (6/8);
the role reversal on screen 2 ("I thought IT would tell ME") surprised 5/8; "Ad Hominem" arrived in
unglossed Latin; heavy shrugging led to "Not enough to be sure," which read as the app giving up.

## What we changed (all four test suites stay green; zero-false-accusation guarantee untouched)

**Root cause A, the frame (copy only):**
- Stopped saying "argument." The input now says: paste something another person said or wrote.
- Moved the example OUT of the textarea into a static, quoted, labeled block, so it reads as an
  example to imitate, not a field to overwrite. The box starts empty with a plain hint.
- Named the job up front ("Does this point actually hold up?"), glossed "fallacy" on the first
  screen, and added a one-line gloss of "Steelman" under the kicker.
- Primary button: "Start" became "Check it." Empty-paste error reworded off "argument."

**Root cause B, the option wall (data; no routing precision lost):**
- Relabeled all 6 buckets to concrete, behavior-anchored, mutually distinct names, each subtitle
  ending in a tiny everyday example so users pattern-match instead of parsing an abstraction. We did
  NOT collapse buckets: they group genuinely different fallacies, so merging would misroute. The
  problem was abstract labels, and concrete labels fix it without losing separation.
- Relabeled the second-level families that read as synonyms (the appeals trio; the two "assumes").
- Folded the five "Other ___" families away. Those families were the SOLE home of 15 fallacies, so
  they could not just be deleted (that would make 15 fallacies unreachable, a real precision loss).
  Instead each orphan fallacy's `family` was reassigned to a named sibling in the same bucket
  (relevance_extra to deflection, presumption_extra to presumption, appeal_extra to
  irrelevant_appeal, language_extra to ambiguity). No tells moved; tells are keyed by fallacy id.
  Every fallacy stays reachable and the distinctness sweep still passes 73/73.
- Re-homed the routing cues that lived on the removed families into their fold targets, so the
  cue-scan auto-suggest routes those arguments exactly as before.

**Root cause C, the thumbs (UI only; engine mapping unchanged):**
- The checklist heading now states it is a list of things a FAIR argument does, and that a 👎 is
  where a weak spot hides, which resolves the inverted mental model.
- Added a one-line legend: "Tap 👍 if it does that, 👎 if it falls short there."
- Button labels went from bare "yes"/"no" to side-anchored "Yes, it does" / "No, it doesn't" /
  "Doesn't apply," pinning the meaning to the question itself.
- The engine mapping is untouched: 👍 (has) still feeds affirmed/pro-VALID, 👎 (lacks) still feeds
  denied/pro-fallacy. Only the wording and labels changed, so no scoring guarantee moved.

## Not changed, on purpose

- The goodwill ending ("ask for the stronger version"). One participant felt lectured, but that is
  the thesis; softening it would betray the whole point.
- The "many won't apply" reassurance. It is load-bearing for anxious users. The early-bailing
  problem is better addressed by shortening the option list (done) than by removing reassurance.

## How it was verified

- `validateBank` clean (0 warnings) after the fold and relabels.
- Per-fallacy distinctness sweep: all 73 fallacies still separate from their (now larger) family and
  name themselves on a confident accuse when their own two strongest tells are denied.
- Cue-routing sanity: the re-homed cues route to the correct buckets/families.
- A headless render check drives the real `src/ui.js` through input to pick to checklist and asserts
  the new copy, the folded families' reachability, and the new thumb labels.
- All four suites (engine, checklist, coverage, calibration) green.

## Re-test (second panel) and the middle-of-flow fixes

The same 8 personas walked the REVISED app; each transcript was adversarially audited for realism in
BOTH directions (the auditor was told to distrust success that looked too clean). All 8 passed.
Grades on the three root causes:

- **A (could not enter a real argument): mostly cleared.** All 8 entered a real third-party claim;
  nobody re-read "argument" as a fight. The "another person said" wording plus the static labeled
  example block are the load-bearing fix. Honest ceiling: the own-grievance instinct is caught, not
  extinguished (a couple started typing their own complaint and were stopped by glancing at the
  example).
- **C (thumb polarity): mostly cleared.** The side-anchored word labels killed the literal "which
  thumb" confusion for all 8. The deeper inverted model (the flaw is a 👎 on a positive question)
  survives, and the rescuing legend is grey so it bounces off pure skim-readers.
- **B (options read as synonyms): partially cleared.** The "Like:" examples de-synonymize most
  buckets for most users, but a real multi-flaw grievance still fits 2-3 buckets and the flow forces
  one. Deliberately left as a separate project (single-bucket pick is a design decision with a
  precision tradeoff).

The re-test surfaced new and residual problems in the MIDDLE of the flow. Three were fixed:

1. **Bucket-to-checklist mismatch (a real bug the relabel exposed).** A user picked the "who said it
   or how many agree" family for a CROWD argument and got a checklist leading with old/new/tradition
   questions, because the crowd fallacy (Bandwagon) and the authority fallacy were not in that
   family at all. Root cause: the appeals bucket was mis-organized. `irrelevant_appeal` was a
   junk-drawer (Authority, Emotion, Nature, Bandwagon + force/flattery/wealth/common-sense) and the
   "standing" family was really tradition/novelty/snob. Fix: reorganized the appeals bucket into
   three honest, balanced (5/5/5) families by what the argument leans on:
   - `appeal_to_standing` ("Points to who said it or how many agree"): authority, bandwagon, snob,
     tradition, novelty. Now an authority OR a crowd argument lands here and the checklist leads with
     matching questions.
   - `emotional_appeal` ("Pulls on your emotions"): emotion (reunited with) fear, pity, ridicule,
     spite.
   - `irrelevant_appeal` ("Leans on pressure, money, or flattery"): force, wealth, flattery, common
     sense, nature.
   Cues were re-homed to follow the moved fallacies, so routing still works. validateBank clean,
   distinctness 73/73, all suites green.
2. **The anti-cynic copy backfired on a correct user.** Pressing two honest 👎 felt like "being the
   cynic the app warned me about." The checklist intro now blesses an honest 👎 as careful noticing,
   not harshness.
3. **The valid verdict read as siding against the user** ("it holds up" heard as "they're right, you
   lose"). All three valid verdicts now state explicitly that the app checks for a weak spot in HOW
   the point is argued and does not rule on who is correct.

Left for later (deliberately, not failures of these fixes): the screen-2 "What feels wrong" role
reversal, Latin fallacy names cold on the result screen, the forced single-bucket pick for multi-flaw
arguments, and same-family checklist rows reading as reworded twins.

## Third panel (focused) and the two residual fixes

A third, focused panel re-walked just the three middle-of-flow fixes: the three affected personas
plus two fresh first-time controls (so we tested the fixes on their own, not only on the people who
shaped them). All 5 transcripts passed the realism audit. Grades:

- **FIX2 (honest 👎 isn't cynicism): cleared.** The "isn't being harsh, it's just noticing" line met
  the guilt at the exact spot; the fresh control was no-gone. Done.
- **FIX1 (crowd/authority bucket match): mostly cleared.** The reorg works (the authority control
  landed perfectly), but a residual remained: the shared standing family front-loaded authority rows,
  so a pure CROWD argument still met "famous name" rows before its match and felt "wrong room" for a
  half second.
- **FIX3 (valid verdict not a who's-right ruling): mostly cleared.** The disclaimer worked but lived
  in muted small print under a stinging headline; the skim-prone user almost missed it.

Both residuals were then fixed (UI only; no data or engine change):

1. **FIX3 residual:** the "About how it's argued, not who's right" frame moved into the verdict
   KICKER, which renders before the headline, so the reassurance is read first and the gut-drop never
   lands. Verified by a render check asserting the kicker precedes the title in DOM order.
2. **FIX1 residual:** within an equal-weight tie, checklist rows now lead with the one whose wording
   best matches the user's own argument, via a tiny relevance heuristic (literal word overlap plus a
   4-concept synonym map for crowd / authority / tradition / novelty). A crowd argument now leads with
   the "how many people believe it" row; an authority argument leads with the "famous name" row; with
   no argument text it falls back to the original weight order. This only reorders ties, so it cannot
   change which fallacy scores or the verdict (verified: scoring is set-based and order-independent).
