# Human study kit: where does the lostness live?

A turnkey protocol for the first REAL-human test of Steelman. Every "panel" in this folder is AI
personas; the owner's report that real humans feel lost is the only human signal the project has.
This study localizes it.

## The two hypotheses

- **H-routing:** people get lost choosing a bucket and family. Discriminating "assumes too much"
  from "over-reaches the evidence" is the expertise the app exists to provide, so asking the user
  to route is asking them to do the app's job.
- **H-contract:** people get lost because the roles feel reversed at the confirm and verdict steps.
  They came to be told; the app asks them to rate virtues and then hands the judging back.

Both can be true. The study yields a per-screen loss budget either way.

## Participants and logistics

- 8 to 12 people who have never seen the app and would not call themselves logic nerds.
- One facilitator (you), one laptop, screen recording on if the participant consents.
- 30 to 40 minutes each. Think-aloud: ask them to narrate what they think the app wants.
- Do not say "fallacy study." Say: "an app that checks whether an argument holds up. I want to
  see where it confuses people. The app is being tested, you are never the one failing."

## Conditions

- **A. Full flow.** Paste through verdict, unaided. The facilitator only prompts thinking aloud.
- **B. Routing bypass.** The facilitator pastes the argument and clicks to the correct family
  screen before handing over. The participant starts at the move pick or checklist. This removes
  routing surgically while keeping confirm and payoff intact.
- **C. Wrong-room plant (2 or 3 participants only, last argument of their session).** The
  facilitator clicks to a WRONG family and hands over as if it were right. Tests whether real
  humans get bounced by the safety net or confirm a wrong fallacy because the room framed their
  reading. Debrief immediately after.

Each participant: 3 arguments in condition A, 2 in condition B, in alternating order (half start
with A, half with B). Never the same argument twice for one person. Rotate which arguments land
in which condition across participants.

## Materials: the eight arguments

All are from `data/blind-corpus.json` (authored blind to the app's cue data, so cue hits and
misses below are honest). Print them on cards or keep them in a text file to paste from.
"Hint" says what the app's cue scan does on this text, measured; that is part of the design.

1. **ad_hominem, no hint.** Routing must be fully manual.
   "Don't waste time on Marco's budget proposal for the club. The guy is 35, still lives with
   his mom, and can't keep a houseplant alive. Whatever he wrote about our finances is obviously
   garbage."
2. **circular_reasoning, no hint.** Structure-driven family, classic checklist path.
   "He's obviously the best coach in the league. How do I know? Because no coach in the league
   is better than him. It really is that simple."
3. **bandwagon, no hint.** Crowd topic, gate stays shut anyway.
   "My brother switched to that bank this year, then both my neighbors, then basically the whole
   gym group chat. That many people making the same call can't all be wrong. I'm moving my
   account over this weekend."
4. **no_true_scotsman, WRONG hint (suggests deflection).** Does a trusting reader follow a wrong
   suggestion, and do they recover?
   "No serious runner skips a race over a bit of rain. What about Dave, who skipped Sunday? Well
   then Dave isn't a serious runner, is he. Serious runners run, that's exactly what makes them
   serious."
5. **survivorship_bias, CORRECT hint (suggests statistical).** The happy fast path.
   "Every founder they interview on that podcast dropped out of college, so clearly dropping out
   is the smart route to building a company. You never hear the hosts talking to people who
   finished their degree. The pattern speaks for itself."
6. **VALID, WRONG hint (suggests statistical/formal).** Calibration under a false hint: this must
   end at holds-up.
   "The lease renewal is due Friday, and legally we either sign it or we don't, there is no third
   status for the contract. If we sign, we're locked into the higher rent for a year. If we
   don't, we have to give notice and start packing. Either way the decision has to happen by
   Friday, so let's sit down tonight."
7. **VALID, no hint (bandwagon-flavored trap).** The pure goodwill path.
   "Pretty much everyone in the group chat swears the shortcut over the hill is faster, but
   that's not why I take it. I timed both routes five mornings each, leaving at the same time,
   and the hill route averaged nine minutes less. The crowd happens to be right, but the
   stopwatch is my reason."
8. **appeal_to_pity, no hint.** Everyday emotional register.
   "I know my essay missed half the requirements, but I've had the worst month, my car broke
   down and my cat has been sick the whole time. Giving this a C would just be piling on. Surely
   all of that counts for a better mark."

## What to record (per argument, per screen)

Use one row per argument on the coding sheet below.

1. **Where they stalled or bailed.** Screen name plus roughly how long they sat.
2. **Confusion type**, coded from the think-aloud, three codes:
   - `WHICH` ("these options are the same thing"): supports H-routing.
   - `JOB` ("what does it want from me?" / "I thought it would tell me"): supports H-contract.
   - `POLARITY` ("which thumb do I press?"): supports H-contract (confirm step).
3. **Outcome vs the label above.** Right fallacy, wrong fallacy, holds-up, or gave up.
   Any accusation on arguments 6 or 7 is a calibration incident; record verbatim how it happened.
4. **After each screen, one probe:** "What is the app doing right now, and what does it want
   from you?" Wrong answers are data, never correct them mid-flow.
5. **At their verdict:** "In your own words, what did the app just tell you?" Then: "Whose
   conclusion is that, yours or the app's?" (The premises block on the verdict is new; note
   whether they read it and whether the answer becomes "both.")
6. **Exit question:** "Would you use this on a real argument this week? Why or why not?"

## Coding sheet (copy per participant)

| Arg | Cond | Bail screen | WHICH | JOB | POLARITY | Outcome | Verdict-in-own-words OK? |
|-----|------|-------------|-------|-----|----------|---------|--------------------------|
| 1   | A/B  |             |       |     |          |         |                          |
| ... |      |             |       |     |          |         |                          |

## Discrimination logic (decide before running)

- **H-routing wins** if condition A failures cluster at bucket and family screens (WHICH codes
  dominate, wrong rooms entered) AND condition B rescues those same people (they sail once
  routing is removed).
- **H-contract wins** if condition B fails at roughly condition A's rate, JOB and POLARITY codes
  dominate, and people who reach a correct verdict still rate it flat ("so... it's fine?").
- **Both** (the likely result) gives the per-screen loss budget: spend the next authoring pass on
  the biggest line item, with numbers instead of panel guesses.
- **Condition C** independently red-teams the zero-false-accusation guarantee against primed
  humans. The engine-level sweep says honest answers in a wrong room never accuse; C tests
  whether a planted frame makes real answers dishonest.

## Kill criteria (pre-committed)

- Any accusation on arguments 6 or 7, in any condition: stop UX work, fix calibration first.
- Condition B rescues nobody: deprioritize all routing work, spend everything on confirm/payoff.
- Condition B rescues everyone: routing is the bottleneck; the funnel itself is the next target.
- Half or more participants answer the exit question "no" for the same stated reason: that reason
  outranks everything above.

## After the study

Write the per-screen loss budget and the coded tallies into a `HUMAN-STUDY-RESULTS.md` next to
this file, with anonymized quotes. Every future panel and copy pass should cite it instead of
persona guesses.
