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
