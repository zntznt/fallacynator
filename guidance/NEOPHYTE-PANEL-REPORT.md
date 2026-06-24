# Steelman — Neophyte Usability Panel

_Six ordinary, non-expert readers (a teen, an ESL speaker, a skim-reading parent, an app-new 68-year-old, a low-confidence user, an impatient skimmer) each walked the real app copy and reported where the writing lost them. Then a plain-language editor synthesized the fixes._

## Verdict

> No — not today: an ordinary person hits a word they don't know in the very first headline ("fallacy"), can't tell ✓ from ✗ on the checklist, and faces 155 long, look-alike, textbook sentences they'd never read; all six readers bailed before the verdict.

## Top problems (ranked, with how many of 6 readers hit each)

1. **[blocker]** _(6 of 6)_ The word 'fallacy' is never explained, yet it owns the headline (Start) and the payoff (Verdict). The app's whole subject is a word readers don't know, so they're lost on screen 1 and still lost at the end. ('skeptical/skepticism' is the same story — appears on Start, Bucket, and Verdict, never defined.)
   - Where: Start headline 'Is there really a fallacy, or am I just being skeptical?'; Verdict lines using [FALLACY] and 'healthy skepticism'
2. **[blocker]** _(6 of 6)_ The 155-line checklist is impossible: too many items, every line a long abstract sentence, many saying the same idea three different ways, and many obviously irrelevant to the reader's example. Readers tire after ~5 lines and quit. This is the single biggest body of copy and it defeats everyone.
   - Where: Checklist screen — all 155 tick lines + '--- ALL 155 CHECKLIST LINES ---'
3. **[blocker]** _(6 of 6)_ The ✓/✗ instruction is backwards from intuition and readers can't tell what they're rating. ✓ means 'the argument does this GOOD thing' but every line is phrased as a virtue, so to tick it a reader must (1) decode the abstract line, (2) realize it's a 'good' behavior, (3) decide if their clearly-bad example has it, (4) flip 'no' into ✗ without scrambling it. Readers expected ✓ = 'yes this argument has this problem.' The hover help doesn't rescue it.
   - Where: Checklist instruction 'Tick ✓ for what it does well, ✗ for what it falls short on...' and hover '✓ = It does this   ✗ = It falls short here'
4. **[blocker]** _(6 of 6)_ The family list (20+ rows) is a wall of near-identical, textbook sentences. Titles like 'Conditional slips', 'Shifts the burden of proof', 'Slides between meanings' and four catch-alls all starting with 'Other' blur together. Readers stop reading carefully and click the first row that has a familiar word in it.
   - Where: Family screen — all 21 rows, esp. the 'Other...' rows and 'Shifts the burden of proof', 'Conditional slips', 'Assumes what it should establish'
5. **[major]** _(6 of 6)_ The six bucket options sound the same and use odd verb phrases ('over-reaches the evidence', 'mishandles the logic', 'leans on the wrong thing'). Readers can't match their own sentence to any one, so they pick at random.
   - Where: Bucket screen options 'It over-reaches the evidence', 'It mishandles the logic', 'It leans on the wrong thing', 'It misses the point'
6. **[major]** _(4 of 6)_ Broken-looking placeholders. The Start body ends in '[…]' (literally cut off) and the Verdict shows '[FALLACY]' in brackets. Multiple readers thought the page failed to load or the app was unfinished, which kills trust before they begin.
   - Where: Start body 'We'll read it at its strongest first, […]'; Verdict 'There may be a gap here — it looks like [FALLACY].'
7. **[major]** _(4 of 6)_ The Start helper uses 'charitably' and 'a fair hearing', read as charity/donations and a courtroom. Readers can't tell what action to take, so they ignore the instruction entirely.
   - Where: Start helper 'Read it as charitably as you can first. Good arguments deserve a fair hearing.'
8. **[major]** _(3 of 6)_ The footer 'You're looking for what holds up, not hunting for flaws' contradicts the Bucket task ('pick the thing that feels off'). Readers feel told to do two opposite things and aren't sure what their job is.
   - Where: Bucket footer 'You're looking for what holds up, not hunting for flaws.'
9. **[minor]** _(2 of 6)_ 'and that's okay' / trailing '…' appear repeatedly across Bucket and Verdict. Faster readers read it as preachy, coddling, fake-gentle — it lowers trust rather than warming them.
   - Where: Bucket 'Maybe you're just being a little skeptical, and that's okay'; Verdicts 'Not enough to call it — and that's okay.', trailing '…' on several verdict lines

## Systemic patterns to fix across ALL copy

- Turn every checklist line into a plain yes/no QUESTION ('Does it…?'). Flat virtue-statements force the reader to (1) decode it, (2) realize it's a 'good' thing, (3) judge their example, (4) flip the answer into ✓/✗. A question collapses all four into one obvious 👍/👎. This is the single highest-impact change across the 155 lines.
- Kill the 'X, not Y' two-clause construction. Almost every checklist line and family row is 'does GOOD thing, not BAD thing' — readers lose the first half by the time they reach the second. Lead with the one thing being asked; cut the contrast or move it to a sub-line.
- De-duplicate ruthlessly. Multiple readers noticed lines 1/2/3 (and others) say the same idea reworded. Merging duplicates is the fastest way to shrink the 155-line wall that defeated all six readers. Also: only show checklist lines relevant to the chosen family — irrelevant lines ('prestige of the name' on a personal-attack example) destroyed trust.
- Never ship an undefined technical term in a hero or payoff line. 'fallacy' and 'skeptical' are the app's core words and appear unexplained on the first and last screens. Define them once in plain words ('a hole in the reasoning'), or replace them everywhere with the plain phrase.
- No raw placeholders or trailing '…' in shipped copy. '[…]' and '[FALLACY]' read as broken/unfinished and killed trust before readers began; trailing '…' read as unfinished or preachy. Always render the final, complete string.
- One idea per line, ~12 words max, and avoid stacking 'or' lists ('a feeling, a name, naturalness, or popularity'). Long 'or' chains and dash-joined sentences are where the ESL and slow/skim readers consistently lost the thread.
- Prefer concrete verbs over abstract metaphor verbs. 'leans on', 'rests on', 'over-reaches', 'mishandles', 'holds up', 'engages', 'weighs' were all read literally (lean on a wall, rest = sleep) by the ESL reader and felt textbook to others. Say what actually happens ('is built on', 'claims more than the proof shows').
- Don't make titles all start with the same word. Four family rows start with 'Other' and many checklist lines start with 'Rests on…' / 'Engages…' — they visually merge into a wall. Vary the opening word so rows stay distinguishable when skimmed.
- Keep the warmth but spend it once. 'and that's okay' and gentle '…' used 3+ times across screens read as patronizing/fake to faster readers. One sincere reassuring line beats the same soft phrase repeated.
- Match the symbol to intuition. Readers expected a check to mean 'yes, this problem is present.' Either flip to that mental model or, better, use 👍/👎 with explicit 'DOES this / DOESN'T' labels so there's no symbol to decode at all.

## Word swaps (hard → simple)

| Hard | Simple |
|---|---|
| fallacy | a hole in the reasoning / a thinking mistake |
| skeptical / skepticism | doubtful / being careful |
| charitably | in the best light / give it a fair chance |
| a fair hearing | a fair chance |
| merits / on its own merits | on the actual reasons / on whether the reasons are good |
| over-reaches the evidence | claims more than the proof shows |
| mishandles the logic | the steps don't add up |
| leans on / rests on | is built on / depends on |
| holds up | is solid / makes sense |
| burden of proof | who has to prove it |
| vice versa | or the other way around |
| establish | prove |
| naturalness | calling it 'natural' |
| benefit of the doubt | the fair chance we gave it |
| feels off | feels wrong |
| it seems sound | it looks fine to me |
| flaws | problems |
| cherry-picked | only the examples that help / hand-picked |
| anecdotes / one-off anecdotes | a single story |
| comeuppance | getting what they deserve |
| engages the claim / addresses the point | answers what was actually said |
| character or motives | the person or why they said it |
| representative | a fair sample / typical |
| correlation | two things happening together |
| mechanism | how it actually causes it |
| proportionate | the right size |
| premise / premises | the starting reasons |
| prestige of the name | how famous the name is |
| conditional / if-then | an 'if this, then that' step |
| steelman / Steelman | (app name — add a tagline like 'Test an argument, fairly') |

## Exact line rewrites

**1. Start (headline)**
- Now: Is there really a fallacy, or am I just being skeptical?
- New: Is something actually wrong with this argument — or am I just being doubtful?
- Why: Kills the two words ALL six readers tripped on ('fallacy', 'skeptical') right where the app introduces itself. Keeps the warm 'maybe it's just me' tone, but now a 12-year-old knows what the app is for in one read.

**2. Start (body)**
- Now: Paste an argument you’re unsure about. We’ll read it at its strongest first, […]
- New: Paste an argument you're not sure about. We'll look at the best version of it first, then check it together.
- Why: Removes the broken-looking '[…]' that 4 readers thought meant the app failed to load, and finishes the thought in plain words ('best version' instead of 'at its strongest').

**3. Start (helper)**
- Now: Read it as charitably as you can first. Good arguments deserve a fair hearing.
- New: Give it the best read you can first. A good argument deserves a fair chance.
- Why: 'charitably' read as charity/money and 'a fair hearing' as a courtroom by 4 readers. Same generous, goodwill-first spirit, but now it tells you what to actually do.

**4. Start (button)**
- Now: Think it through →
- New: Start →
- Why: Walt and others didn't know what they'd be 'thinking through' yet. A plain 'Start' is the safe, expected first action.

**5. Bucket (helper)**
- Now: Pick the kind of thing that feels off, then we’ll narrow it — or, if it reads fine, say so.
- New: What feels wrong about it? Pick the closest one. (If it seems fine, you can say that too.)
- Why: Breaks one long dash-and-'or' sentence into a short question plus a short aside — the kind of long 'or' sentence Tomás and Walt lose the thread of. 'feels wrong' beats 'feels off' (read as 'lights off').

**6. Bucket (option)**
- Now: It over-reaches the evidence
- New: It claims more than the proof shows
- Why: 'over-reaches' was unknown to 5 readers (reach with an arm? reach over what?). Plain words make it pickable.

**7. Bucket (option)**
- Now: It mishandles the logic
- New: The steps don't add up
- Why: 'mishandles' and 'the logic' were vague to 5 readers and sounded scary/expert-only to Priya. Concrete and friendlier.

**8. Bucket (option)**
- Now: It leans on the wrong thing
- New: It points at the person, not the point
- Why: Several readers couldn't tell this from 'It misses the point'. Naming the most common case (attacking the person) makes it concrete and matches the sample example ('she failed a class').

**9. Bucket (option sub)**
- Now: Nothing — it seems sound  (sub: Maybe you’re just being a little skeptical, and that’s okay)
- New: Nothing — it looks fine to me  (sub: Maybe it really is fine. That happens a lot.)
- Why: 'sound' was read as noise/music by Tomás; 'skeptical' is the undefined word; 'and that's okay' read as preachy by Deon. New sub keeps the reassurance without the therapy-app tic.

**10. Bucket (footer)**
- Now: You’re looking for what holds up, not hunting for flaws.
- New: Tip: we start by trusting the argument, then look for any real problem.
- Why: 3 readers felt this footer contradicted the 'pick what feels off' task. Reframing as a 'we start by trusting it' tip keeps the goodwill-first prior without telling them to do the opposite of the screen.

**11. Family (row)**
- Now: Shifts the burden of proof — It treats 'not disproven' as 'proven', or vice versa
- New: Flips who has to prove it — Says 'you can't prove it's false, so it's true' (or the other way around)
- Why: This row was named by 5 readers as the bail point — 'burden of proof', 'not disproven', 'vice versa' stacked in one line. A concrete worked example replaces the jargon.

**12. Family (row)**
- Now: Assumes what it should establish — It seems to take its starting point for granted instead of supporting it
- New: Assumes what it needs to prove — It treats its starting point as true without backing it up
- Why: 'establish' and the idiom 'take for granted' lost 4 readers. 'prove' and 'without backing it up' are plain and keep the meaning.

**13. Family (row)**
- Now: Conditional slips — It draws the wrong move from an if-then
- New: 'If-then' mix-up — It gets the wrong lesson from an 'if this, then that' rule
- Why: 'Conditional slips' as a title means nothing to ordinary readers (sounds like math/coding to Walt, Priya, Deon). Spelling out 'if this, then that' makes it human.

**14. Family (row)**
- Now: Other misplaced appeals — It rests on a source of pull that does not bear on truth
- New: Leans on the wrong kind of reason — It pulls on something that doesn't actually show it's true
- Why: 'a source of pull that does not bear on truth' was unreadable to Tomás (pull a door? bear the animal?). The four 'Other…' catch-alls also confused everyone; renaming them so they don't all start with 'Other' stops them blurring together.

**15. Checklist (instruction)**
- Now: Tick ✓ for what it does well, ✗ for what it falls short on, and leave the rest blank. We start by assuming it holds up.
- New: For each line: tap 👍 if the argument DOES this, 👎 if it DOESN'T, or skip it if you're not sure. We start out trusting the argument.
- Why: The ✓/✗ direction broke all 6 readers. Replace abstract ✓/✗ with 👍/👎 mapped to a dead-simple yes/no ('DOES this' / 'DOESN'T'), drop the idiom 'falls short', and rephrase 'holds up' as 'trusting the argument'. Crucially, pair this with rewriting every checklist line as a plain yes/no question (see pattern note) so 'DOES this' has a clear referent.

**16. Checklist (hover)**
- Now: ✓ = It does this   ✗ = It falls short here
- New: 👍 = yes, it does this   👎 = no, it doesn't
- Why: 'It falls short here' is an idiom Tomás and others didn't know, and 'this' had no clear referent. A literal yes/no pairing removes the mental flip.

**17. Checklist (line, example of the rewrite pattern)**
- Now: Engages the claim itself, not the character or motives of who made it
- New: Does it argue against the idea — not the person who said it?
- Why: This is the single most-cited line. As a flat statement readers can't tell if ticking means 'good' or 'this is the problem.' As a plain yes/no QUESTION, 👍/👎 becomes obvious. Apply this 'Does it…?' question form to all 155 lines.

**18. Checklist (line)**
- Now: Weighs the claim on its own merits, not on reasons to distrust the speaker
- New: (merge with the line above — delete this duplicate)
- Why: Readers said lines 1, 2, 3 are the same idea reworded. De-duplicating is the fastest way to shrink the 155-line wall and stop the 'why am I ticking this three times' annoyance.

**19. Checklist (line)**
- Now: Folds the rarity of the condition into the odds rather than reading a positive as near-certain
- New: Does it remember that a rare thing is still rare, even after a positive test?
- Why: Called 'word soup' by Dawn. Plus, lines like this should only appear when the chosen family is about numbers — showing it on an 'attacks the person' example is why readers said irrelevant lines destroyed their trust.

**20. Checklist (line)**
- Now: Rests on reasons the conclusion is right, not on someone getting their comeuppance
- New: Does it give real reasons — not just 'they had it coming'?
- Why: 'comeuppance' was a word Tomás had literally never seen and could not guess. 'they had it coming' is plain and keeps the meaning.

**21. Verdict (GAP)**
- Now: There may be a gap here — it looks like [FALLACY].
- New: There may be a weak spot here — it looks like {fallacy name, in plain words}.
- Why: '[FALLACY]' reads as a broken placeholder (Dawn, Priya) AND uses the undefined word. Make sure the real, plain-language name fills in, and swap 'gap' for the clearer 'weak spot'.

**22. Verdict (VALID checked)**
- Now: nothing rose above the benefit of the doubt
- New: we gave it a fair chance, and it held up
- Why: 'rose above the benefit of the doubt' was a confusing mashup for 4 readers who couldn't tell if it passed or failed. Plain version makes the good result obvious while keeping the generous tone.

**23. Verdict (CYNIC)**
- Now: There may be no fallacy here at all — you might just be reading it with healthy skepticism…
- New: There may be nothing wrong here — you might just be reading it carefully, which is a good thing.
- Why: Uses the two undefined words ('fallacy', 'skepticism') in the final screen, and the trailing '…' plus 'healthy skepticism' made Deon feel gently called paranoid. Plain words, warm, and finishes the sentence.

## What works (keep)

- Short, plain bucket/family TITLES landed even when the explainer didn't: 'Against the person' and 'It misses the point' were understood and even matched to the sample example. Keep the human, plain-word titles and cut or simplify the long explainer tails under them.
- The placeholder example 'We can't trust her plan — she failed a class in college.' is concrete and relatable — readers used it as their anchor throughout. Keep concrete examples like this and tie checklist/family wording back to it.
- The goodwill-first, 'we start by trusting the argument' premise is genuinely liked in spirit — readers found the gentleness appealing when it wasn't overdone. Keep the charitable framing; just say it in plain words and don't repeat 'and that's okay'.
- The 👍-style 'it does this / it falls short' hover was reaching for the right idea (a per-line yes/no). The intent is good; it just needs literal yes/no wording and a question on each line to actually work.
- 'It misses the point' as a bucket option was clear to multiple readers — proof that short, everyday phrasing for these options is achievable; bring the other five options down to this level.
- The overall promise — 'paste an argument, we'll check it with you' — is understood and appealing once the jargon is stripped. The product idea isn't the problem; the vocabulary is.

---

## Reader walkthroughs (raw)

### Reader 1: Mara, 15 — reads fine but hates long sentences and abstract/textbook words. Never heard of "logical fallacies." Bails the second something feels like homework.
**Would finish:** no — I'd bail on the family screen at the latest (it's a giant wall of weird words), and honestly the checklist would've finished me off if I got that far.

**Checklist experience:** Bad. I couldn't tell what most lines were even asking, so ticking ✓ or ✗ felt like guessing. The instruction says ✓ = 'does this well' and ✗ = 'falls short', but I'm rating my OWN sentence and the lines talk about it like it's a person doing stuff, which scrambled my head. Each line is two ideas stuck together with a 'not' in the middle (does X, not Y), so I had to figure out both halves before I could decide — way too much work. I'd just leave everything blank or tick randomly. It feels exactly like a worksheet a teacher hands out.

**Overall:** It looks smart but it reads like a textbook from the first line, and by the screen with the huge list of weird word-rows I'd just close it.

### Reader 2: Tomás, 34, native Spanish speaker, intermediate English. Reads literally, knows nothing about "logical fallacies", trips on idioms and long "or" sentences.
**Would finish:** probably-bails-at-Checklist — I can do Start and maybe pick a bucket, but the checklist is a wall of long, abstract English sentences and I would not know how to tick most of them, so I give up there.

**Checklist experience:** Bad. I understand the symbols a little — ✓ is good, that I get. But ✗ they say is 'falls short' and I don't know that idiom, so I am not sure if ✗ means 'bad' or 'missing' or 'I disagree'. The button hover '✓ = It does this   ✗ = It falls short here' helps a small bit for ✓ but 'falls short' still confuses me. The bigger problem: every checklist line is a long abstract sentence about 'claims' and 'reasons' and 'evidence', and I cannot tell if my example sentence ('We can't trust her plan — she failed a class in college') does that thing or not. To tick ✓ or ✗ I must first understand the line AND understand my example AND match them — three hard steps. I cannot do it. So I would tick at random or just leave everything blank. And there are 155 of them, all looking the same, which is impossible — I am tired after the first five.

**Overall:** From the very first title with the word "fallacy" I don't understand what this app is or what I should do, and by the long checklist sentences full of words like "comeuppance" and "cherry-picked" I feel stupid and I close it.

### Reader 3: Dawn, 41, three kids, sharp but reads the first five words of anything and then decides. Never heard of "logical fallacies." Skips anything longer than a text.
**Would finish:** probably-bails-at-the-checklist — I'd get through the buttons fine, but the second I hit a wall of 155 long sentences I'd close it.

**Checklist experience:** Awful, honestly. First, the rule is backwards from my gut: I'd expect to check the things that are WRONG, but it says tick ✓ for what it does WELL and ✗ for what it falls short. So a check means good and an X means bad — I had to stop and think about that, and I never fully trusted it. Second, every single line is a long, abstract sentence — way past my five-words-and-done limit — and most of them sound like the same thing reworded three times ('Engages the claim,' 'Weighs the claim,' 'Actually addresses the point'). I couldn't tell if ticking meant 'yes my argument is good here' or 'yes this is the problem.' And then I saw it's 155 of them. There is no version of me sitting and reading 155 sentences. I can't tell what any single line is really asking me to judge about MY sentence about the woman who failed a class. ✓ vs ✗ does not make sense to me at a glance.

**Overall:** The buttons and titles were almost okay, but every real sentence is too long and too smart for me, it starts and ends on a word I don't know ('fallacy'), and 155 things to tick is a hard no — I'd close it before I ever got an answer.

### Reader 4: Walt, 68, retired, smart but brand-new to phone apps. Reads everything slowly and literally. Has never heard of "logical fallacies" and does not use words like premise or validity. Worries the whole time that he is doing it wrong.
**Would finish:** No — probably bails on Screen 3 (the family list) and would 100% give up at the 155-line checklist; he never reaches the verdict.

**Checklist experience:** It felt awful and backwards. First, the checkmark meaning is flipped from what I know — to me ✓ means 'right/correct' and ✗ means 'wrong,' but here ✓ means the argument did something GOOD and ✗ means it did something BAD, so every line I had to stop and re-remember which mark was which. Second, I could not tell what most lines were even asking. Each one is two clauses joined by 'not' — by the time I read the second half I'd lost the first half, and then I still couldn't say whether my sentence 'she failed a class' does that thing or not. So I couldn't honestly tick ✓ OR ✗ — I just left them blank and felt stupid. And there are 155 of them. I would never get through it; I'd quit within the first three or four lines.

**Overall:** From the very first word "Steelman" to a 155-line checklist of dressed-up sentences I couldn't connect to my own example, I felt talked-over and sure I was doing it wrong the whole time — this is built for someone who already knows the lingo, not for an ordinary person like me.

### Reader 5: Priya, 27 — second-guesses herself constantly, freezes at vague instructions, never heard of "logical fallacies," doesn't use words like "premise" or "validity." Ordinary user, not a logic person.
**Would finish:** Probably bails at the checklist (Screen 4) — the ✓/✗ instruction flips my brain inside out and there are way too many long abstract lines; I'd close the tab before getting a verdict.

**Checklist experience:** Honestly the worst part. The ✓/✗ idea sounds simple but in practice it fights my brain: every line describes a GOOD thing the argument supposedly does, but I'm here because I think the argument is BAD — so ✓ feels like I'm praising the thing I came to criticize, and ✗ feels like the 'gotcha.' I could never settle on which symbol I meant. On a line like 'Engages the claim itself, not the character or motives of who made it,' I have to (1) decode the abstract sentence, (2) figure out it's describing a virtue, (3) decide whether MY argument has that virtue, then (4) translate 'no it doesn't' into the correct symbol (✗?) without flipping it. That's four mental steps per line, and I'd get it backwards half the time. The hover '✓ = It does this   ✗ = It falls short here' didn't rescue me because 'this' is vague. I never felt sure ✓ vs ✗ made sense; I'd have left most blank out of fear and that probably ruins the result.

**Overall:** It made me feel stupid from the first sentence (a word I didn't know) to the last (the same word in brackets), and the checklist where I had to keep guessing whether ✓ meant good or bad was so stressful I'd just close it.

### Reader 6: Deon, 23, fast reader, no logic background, allergic to preachy/repetitive copy
**Would finish:** probably-bails-at-Screen-3 — the family list is 20+ long abstract sentences that all blur together, and if I somehow push past it the 155-line checklist would finish me off.

**Checklist experience:** Rough. Two problems hit at once. First, the ✓/✗ rule is backwards from my gut: I expected ✓ = 'yep, the argument does this (bad) thing,' but here ✓ = 'it does this WELL.' Every line is written as the GOOD version ('Engages the claim itself...'), so to tick it I have to figure out whether my clearly-bad example does the good thing, which is a mental flip on every single line. Second, tons of lines say the same idea three different ways ('don't attack the person' appears like 3-4 times) and tons of others ('prestige of the name', 'inconsistency it raises') clearly have nothing to do with my argument, so I can't tell which lines even apply to me. I'd end up leaving most blank or ticking randomly just to get to the end. ✓ vs ✗ did NOT make intuitive sense.

**Overall:** It reads like a logic textbook wearing a fluffy 'and that's okay' sweater — too many big words I don't know, the same point repeated three ways, and a list so long I'd quit before the verdict.


---

## Applied (response to this panel)

All copy rewritten for a ~12-year-old reading level, warm goodwill voice kept. Decisions confirmed with the product owner:

- **Checklist (the #1 blocker):** all 155 tell lines rewritten as plain **"Does it…?" questions**; ✓/✗ replaced with **👍 / 👎** ("yes, it does this" / "no, it doesn't"). Instruction: *"Tap 👍 if it does, 👎 if it doesn't, or skip it if you're not sure. We start out trusting the argument."* Engine keys on `qid`, never on text, so the math and the 0-false-accusation guarantee are untouched — polarity verified end-to-end (👎👎 → accuse, 👍×N → valid_earned).
- **Jargon:** "fallacy"/"skeptical" removed from user copy; app name **Steelman** kept. Headline → *"Is something actually wrong with this argument — or am I just being doubtful?"*
- **Family picker:** kept **problem-framed names** (panel said "Against the person" already worked) but gave each a short plain problem-framed prompt; the four "Other…" rows now have distinct openings; "Conditional slips" → "If-then mix-up".
- **Buckets:** plain names for the three flagged ("It claims more than it shows", "The steps don't add up", "It points at the wrong thing"); kept "It misses the point" (praised).
- **Verdicts:** "gap" → "weak spot"; "holds up" → "makes sense"; removed "benefit of the doubt", "healthy skepticism", repeated "and that's okay".
- **Not changed:** `questions.json` text (feeds only the retired legacy interview; added a pointer comment). `index.html` tab title (defensible, not in the tested flow).

A polarity-checking adversarial verifier reviewed all 155 rewrites: **no inversions found.** All four test suites green; 0 false accusations preserved.
