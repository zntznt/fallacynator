# Steelman — UI/UX Panel Review

_4 design lenses (visual, interaction, accessibility/WCAG, mobile) → 39 findings → verified against the real CSS/markup → 37 confirmed → prioritized plan._

## State

> Steelman's calm, goodwill-first concept and copy are genuinely strong, but a parked-mascot dead gap, a never-revealed footer, no progress or focus management, and a handful of accessibility gaps (unnamed emoji buttons, unannounced screen swaps, weak borders) hold the rendered result below its own bar.

## Quick wins

1. **Collapse the empty mascot reserve. In src/styles.css change #mascot-canvas (line 346) min-height:84px to min-height:0, and add #mascot-canvas:has(#mascot-img:not([hidden])){min-height:84px;} so the slot re-expands automatically once real art ships.**
   - The parked mascot leaves ~76px of dead space above every single card (84px min-height minus the -0.5rem margin), pushing the card off true vertical center on the first thing the eye hits. Confirmed: mascot/ has no PNG art, the <img> stays hidden, nothing collapses the host.
2. **Reveal the footer. In uxx-ui.js boot()'s try block, right after renderStart() (line 34), add: document.querySelector('.site-foot')?.removeAttribute('hidden');**
   - index.html ships <footer class="site-foot" hidden> and .site-foot[hidden]{display:none} (line 235) keeps it hidden forever; nothing in JS ever removes the attribute, so the brand line 'Innocent until proven otherwise.' and the only source link never render.
3. **Stop the body from clipping a tall checklist. In styles.css change body justify-content:center (line 45) to flex-start, add body{overflow-y:auto;}, and add margin-block:auto to #app (line 60).**
   - A column flex with justify-content:center and content taller than the viewport overflows symmetrically; the top (recall quote + heading) lands at a negative offset and cannot be scrolled to. A fully expanded 11-row checklist on a short laptop/landscape viewport strands the top of the card. Auto margins center only when there is room.
4. **Give empty-paste a real message, not just a silent outline. In renderStart, on the empty branch set an inserted <p id='arg-err' class='error' role='alert'> with text 'Add an argument first, then Start.', set aria-invalid + aria-describedby on the textarea, and add a ta input listener that clears all three. Keep the outline as a secondary cue.**
   - Currently clicking Start with an empty box only repaints ta.style.outline and refocuses (line 121) with no text and no programmatic state; the outline is never cleared on keystroke. This is a color-only cue plus SC 1.4.1/3.3.1/4.1.3 failures, and a user can click Start repeatedly with no explanation.
5. **Name the emoji answer buttons. In mkChoice (uxx-ui.js ~270), set b.setAttribute('aria-label', `${label}: ${r.text}`) and the icon span setAttribute('aria-hidden','true').**
   - Each tri pill's accessible name is computed from 'thumbs up yes' with no tie to its question; a screen reader hears the same yes/no/doesn't-apply triple on every row with nothing distinguishing which question it answers. Genuine SC 4.1.2 failure.
6. **Expose pressed state on the tri pills. In mkChoice add b.setAttribute('aria-pressed','false') at creation, and in refresh() set has/lacks/na aria-pressed to String(choice[r.qid]===kind) alongside the existing classList.toggle('on',...).**
   - The on-state is purely visual (background/border swap); a screen reader announces 'yes, button' with no selected state, so SR users cannot tell what they have chosen. SC 4.1.2 invisible-state failure on the primary interaction.
7. **Add a --line-strong token that actually reaches 3:1 and apply it to interactive borders. :root{--line-strong:#94886f} and dark-mode #736a5c; use it on .btn (line 109), textarea (96), .family-opt (260), resting .tri (313), and optionally .card (65). Keep --line for decorative separators.**
   - --line (#e6ddcf) against the card computes ~1.3:1, far below the 3:1 SC 1.4.11 floor for the visible boundary of controls. The previously proposed #b9ad97 only reaches ~2.2:1, so the token must be darker; #94886f is verified at 3.44:1 vs card / 3.24:1 vs paper.
8. **Standardize the heading scale. In styles.css set .card h2{font-size:1.5rem} and .verdict-title{font-size:1.5rem; margin:.25rem 0 .75rem}, leaving .card h1 at 1.8rem.**
   - The card's main line lands on three close sizes (1.8 h1 / 1.4 h2 / 1.65 verdict-title) with the verdict reading larger than the interior question heads despite the same conversational role. Collapsing to two sizes removes the stray 1.65 and makes visual size track the hierarchy.
9. **Delete dead CSS: .progress/.pip/.pip.on (styles.css 160-173) and .question-text (line 214).**
   - Neither is ever rendered by uxx-ui.js (grep finds only the word inside comments); .question-text is a leftover from the pre-checklist interview. Removing them prevents them being mistaken for half-built features. (If a position cue is wanted, treat it as majorWork, not a hardcoded 4-pip.)
10. **Hide decorative glyphs from screen readers. Wrap the ↺/←/→ in 'Start →', '↺ Start over', '← Back', 'See the result →', '← Pick a different focus', 'Examine another →' in an aria-hidden span (helper: const mkGlyph=ch=>{const s=el('span',{textContent:ch});s.setAttribute('aria-hidden','true');return s;}) and keep the word as a plain text node.**
   - The glyphs sit in button textContent, so the accessible name becomes 'anticlockwise open circle arrow Start over' / 'left-pointing arrow Back'. Decorative chars in the name; SC 1.1.1 / 4.1.2 polish. No CSS change needed.
11. **Tidy checklist row rhythm. In styles.css set .checklist{gap:0} (was .15rem, line 289) and .check-row{padding:.9rem 0} (was .7rem, line 296).**
   - A .15rem flex gap sits below each row's border-bottom, so the rule lands off the visual midpoint and the seam rhythm is uneven. Zeroing the gap puts the border at the true midpoint; the slightly larger padding reads calmer. Leave border color and pill padding alone (already subtle / adequate).
12. **Add a phone padding step. Append to the existing @media (max-width:30rem) block: .card{padding:1.5rem 1.15rem;}**
   - .card is a constant 2rem 1.75rem with no narrow-screen reduction, so at ~360px horizontal chrome eats ~96px before content (card 56 + body 40). A small phone step reclaims room without touching desktop.
13. **Bump tri touch targets to 44px. In styles.css change .tri padding (line 311) to .5rem .3rem and add min-height:44px to the .tri block. Also give .show-more a real target: width:100%; min-height:44px; padding:.7rem .25rem; text-align:center; text-decoration:underline.**
   - The 👍/👎/🤷 pills render ~43px tall and the borderless 'Show more checks' toggle ~39px, both under the 44px HIG/SC 2.5.8 AAA target; the underline also makes the toggle read as an action rather than body text.
14. **Add a reduced-motion override for interactive transforms. Append @media (prefers-reduced-motion: reduce){ .btn,.tri,.family-opt{transition:none} .tri:hover,.btn:active,.family-opt:active{transform:none} }**
   - The current reduced-motion block only zeroes .card animation; the 1px hover/active translates on .btn/.tri/.family-opt stay live. Minor (AAA), but cheap to make consistent with the calm intent.

## Major work

1. **Add focus management on every screen change and fix the live region. Remove aria-live="polite" from #app in index.html. Add a mount(card) helper that does app.replaceChildren(card) then focuses the card's heading (h1/h2/.verdict-title) with tabindex=-1, and call it from every render function (renderStart keeps ta.focus()). Add a small dedicated <p role="status" class="sr-only"> for short status messages. Add h1:focus,h2:focus,.verdict-title:focus{outline:none} (with a focus-visible ring).**
   - clear()=app.replaceChildren() wipes the focused element and no render except renderStart moves focus, so keyboard users re-tab from the top each screen and SR users get no screen-change cue (SC 2.4.3). Meanwhile aria-live on #app announces the entire new card as one blob on every user-initiated navigation. Focus management is the correct mechanism for these user-driven transitions; the two fixes are interdependent.
2. **Make each screen's primary line a real heading. Change the interior question heads (uxx-ui.js 140, 201, 258) from h2 to h1, and change the verdict primary line (346, 367, 385, 417, 435) from el('p',{className:'verdict-title'}) to el('h1',{className:'verdict-title'}). Reconcile sizing in CSS so the new h1s don't all jump to 1.8rem (e.g. a single .card h1 size plus the retained .verdict-title rule).**
   - The document hierarchy starts at h2 (skips h1) on every interior screen, and the verdict payoff line is a styled <p> with no heading element at all, so it is invisible to heading navigation. SC 1.3.1 / 2.4.6. Pairs with the focus-management work since the focus target is the heading.
3. **Give verdict screens a non-destructive way back to the checklist, and preserve checklist answers. Lift choices to module scope (const choices={}; familyId->{qid:state}); in renderChecklist use choices[familyId] so reopening repaints prior pills. Thread familyId through renderVerdict into renderAccuse/renderConfirmed/renderInconclusive/renderCynic, and make restartRow(familyId) add a quiet '← Back to the checks' button alongside the primary 'Examine another →' (which clears choices and argument).**
   - Every verdict dead-ends on 'Examine another →', which wipes the argument and all answers; there is no way to reopen the checklist to adjust one answer. The choice map is function-local and discarded, so answers cannot be restored. This is the only true dead-end in the flow.
4. **Standardize back navigation across non-start screens. Give renderFamilyPick a quiet '← Back' to renderStart that preserves the paste (renderStart re-seeds the textarea from argument), keep '↺ Start over' as a separate, visually quieter reset that clears argument, and rename renderChecklist's '← Pick a different focus' (line 321) to '← Back'.**
   - Three consecutive screens use three different return verbs ('Start over' / '← Back' / '← Pick a different focus'), and family-pick's only way back is the destructive reset. One consistent '← Back' that steps up one screen and never destroys the paste, with reset demoted, removes the nuclear-only return.
5. **Replace the recall blockquote's role='button' with a real expand control. In recallBlock, keep the <blockquote> as a quotation (no role/tabindex/title on it) and, when it overflows, append a sibling <button class='btn btn-quiet'> labeled 'Show full argument' / 'Show less' that toggles the .open class and its own aria-expanded; return a wrapper so call sites are unchanged. Drop the text from the .recall.clamped::after pseudo (keep the gradient as pure fade).**
   - Setting role='button' on the blockquote makes the entire pasted argument the button's accessible name and destroys the quotation semantics; the only 'show more' affordance lives in a CSS ::after pseudo that is not in the a11y tree. SC 4.1.2 plus a missing labeled expand control.

## Nice to have

- Move the accuse decision prompt next to the controls: in renderAccuse, lift f.confirm_check out of the .teaching box and render it as a standalone prompt directly above the .answers row, so the thing being decided sits beside Yes/No.
- Strengthen the resting 'suggested' family highlight so hover doesn't out-compete it: give .family-opt.suggested a fill (var(--accent-soft)) and a 2px inset ring, plus a distinct .suggested:hover; and move the ' · suggested' marker out of the title's text flow into an absolutely-positioned corner pill so it can't wrap the family name.
- Add a small separator beat before the 'Nothing. It looks fine to me' escape hatch in renderFamilyPick, e.g. a muted '…or, if nothing seems off:' label before appending the dashed fine button, so it reads as a distinct option rather than another bucket.
- Add a shared desktop legend for the checklist (one 'For each: 👍 it does this · 👎 it falls short · 🤷 doesn't apply' line) and hide per-pill .tri-label at min-width:30rem, keeping the labels on phones; reduces the repeated yes/no/doesn't-apply text across many rows.
- Give checklist questions a touch more presence: change .check-text to font-size:1.02rem so each 'Does it…?' reads as a distinct item rather than flat body size (pairs with deleting the orphaned .question-text rule).
- Optional: animate the card 'rise' only on first paint (a one-time class set in renderStart) rather than on every screen swap, so later steps cross-fade like turning a page rather than re-dropping a card; gate mascot-in similarly if churn reduction is wanted.
- Optional polish on the recall fade: add padding-right and widen the ::after gradient so even the soft-fade ramp clears the last line of text on a narrow column.

## Keep (do not touch)

- The calm, goodwill-first identity is intact and well-executed: 'We start by trusting the argument, then look for any real problem', the 'Nothing. It looks fine to me' escape hatch, and verdict copy that frames findings about the argument rather than scolding the reader.
- The no-em-dash, plainspoken copy is consistent and considerate (two short sentences, glosses 'fallacy' once on a concrete example, 'type or paste' / phone-first phrasing).
- The color system is restrained and on-brand: muted sage accent, warm clay for tentative suspicion 'never red', gentle valid green, with a full dark-mode palette.
- Selected tri-state contrast is already solid: the on-states swap to valid/suspect/ink-soft backgrounds that all pass AA (na is actually the highest-contrast on-state in light mode) — do not darken them.
- The mascot is correctly fail-safe: aria-hidden host, <img> stays hidden until a real file loads, and steelyStage() is a harmless no-op, so a missing mascot shows nothing rather than a broken icon.
- The recall blockquote's measure-then-clamp approach (only wire the toggle when scrollHeight actually overflows) and overflow-wrap:anywhere for long URLs are the right instincts — keep them, just fix the role/affordance.
- Progressive disclosure on the checklist (LEAD=4, fold when rows>6, folded rows still scored, unanswered = neutral) is a sound way to avoid the 'wall' without changing verdicts.
- The :focus-visible outlines already defined on .btn, .family-opt, and .tri are good keyboard affordances — preserve them when adding programmatic focus.
- reduced-motion already correctly suppresses the mascot idle float and the card entrance animation — keep that and just extend it to the interactive micro-transforms.

---

## Applied in this pass

**Quick wins:** collapsed the parked-mascot 76px dead gap (self-restoring via :has when art ships); fixed body-centering so a tall checklist never clips at the top (justify-content flex-start + #app margin-block:auto + overflow-y); empty-paste now shows a real announced error; named the 👍/👎/🤷 buttons for screen readers (aria-label tied to the question) and exposed aria-pressed state; added --line-strong control-border token (≥3:1 WCAG 1.4.11) in both themes; deleted dead .progress/.pip/.question-text CSS; aria-label on glyph buttons so SR reads words not arrow names; tidied checklist row rhythm; phone card-padding step; 44px touch targets on pills and the show-more toggle; extended reduced-motion to interactive transforms.

**Major work:** focus management on every screen swap (new mount() focuses the heading; removed aria-live blob-announce); promoted every screen primary line to a real h1 (proper heading hierarchy, verdict payoff is now an h1); replaced the role=button blockquote with a real labeled Show full argument button (keeps quotation semantics).

**Engine fix found along the way:** el() used Object.assign, which silently dropped aria-* attributes (they are not reflected DOM properties). Rewrote el() to route role/aria-*/data-* through setAttribute. This makes the whole a11y pass actually take effect.

**Deliberately NOT done:** the panel said to reveal the footer, but the user explicitly asked to hide it; left hidden. Some nice-to-haves (desktop legend, suggested-highlight, escape-hatch separator) deferred.
