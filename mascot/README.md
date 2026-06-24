# Steely — mascot art spec

The mascot is **parked**: the app runs fine with no art, showing nothing where the mascot goes. Drop
the hand-made image files described below into this folder and they appear automatically — no code
change needed. (Wiring lives in `src/mascot.js`; layout in `src/styles.css` under "mascot".)

## TL;DR for the artist

Make **6 PNG files**, square, **252 × 252 px**, transparent background, named exactly:

```
mascot/steely-input.png
mascot/steely-family.png
mascot/steely-checklist.png
mascot/steely-gap.png
mascot/steely-holds.png
mascot/steely-skeptic.png
```

That's it. As each file lands, that expression starts showing live. Partial sets are fine — any
missing expression simply shows nothing for that stage.

---

## Where it fits

A single image sits **centered, just above the main card**, slightly overlapping its top edge — the
same slot the old animated mascot used. It is decorative (`aria-hidden`), so it never carries meaning
the copy doesn't already give.

- **Displayed size:** 84 × 84 CSS px (`#mascot-img` in `styles.css`).
- **The app gently floats it** up/down ~3px (suppressed under `prefers-reduced-motion`). Your art
  should be a still pose — the motion is added by CSS, don't bake it in.

## Format & dimensions

| | Choice | Why |
|---|---|---|
| **Format** | **PNG-24 with alpha** | Sits on a themed light/dark background, so it needs real transparency. PNG exports cleanly from any tool. |
| **Canvas** | **252 × 252 px, square** | 3× the 84px display box, so it stays crisp on retina/3× phones. Square keeps every expression aligned, so swapping one for another never shifts or jumps. |
| **Background** | **Transparent** | No baked-in card color — the card behind is themed. |
| **Safe area** | Keep the figure within the centered ~220px; leave a few px of breathing room so the float animation never clips. |
| **File size** | Aim < 60 KB each | It's a small on-screen image; keep the page light. |

### Optional: WebP
If you also export WebP (smaller), name them `steely-<expr>.webp`. They're not required and not yet
wired — PNG is the canonical path. If you want WebP served preferentially later, say so and it's a
one-line change in `src/mascot.js`.

### Dark mode
The app has a dark theme. A single PNG with a light face + mid-grey body reads fine on both (the old
mascot did). If you want a dedicated dark variant, we can add `steely-<expr>-dark.png` support — ask
and it's a small change. Default: ship one set that works on both.

---

## The 6 expressions

Steely is a friendly **steel I-beam** character: warm steel-grey body, paper-white face, sage-green
accents. **Open `mascot/_retired-steely.svg` in a browser to see the previous take on each pose** —
it's the visual brief, not a thing to match pixel-for-pixel.

The whole emotional arc is **goodwill-first**: Steely is on the user's side, never smug, never a
"gotcha." Even the "weak spot" pose is concerned-*with*-you, not accusing.

| File | Expression | Mood | Shown when (app stage) |
|---|---|---|---|
| `steely-input.png` | **Welcoming** | open, encouraging, "let's look at this together" | Start screen (`input`) — typing the argument |
| `steely-family.png` | **Curious** | thinking, head slightly tilted, a "hmm?" | Picking the bucket / family (`family`) |
| `steely-checklist.png` | **Attentive** | focused, helpful, steady | The checklist of "Does it…?" questions (`checklist`) |
| `steely-gap.png` | **Gently concerned** | soft, careful, worried-*with*-you — NOT frowning or accusing | A weak spot found (`accuse`, `inconclusive_lean`, `confirmed`) |
| `steely-holds.png` | **Pleased / celebratory** | warm, a little proud, "nice — it holds up" | The argument is sound and the user confirmed why (`valid_earned`) |
| `steely-skeptic.png` | **Easy / reassuring** | relaxed, a small shrug, "maybe it's fine, and that's okay" | No clear problem / cynic verdicts (`cynic_valid`, `cynic_unsure`, `cynic_after_reject`) |

### Stage → expression map (the full routing, for reference)

`src/mascot.js` maps every app stage onto one of the 6 above:

```
input              → input
family             → family
checklist          → checklist
accuse             → gap
inconclusive_lean  → gap
confirmed          → gap
valid_earned       → holds
cynic_valid        → skeptic
cynic_unsure       → skeptic
cynic_after_reject → skeptic
```

So 6 images cover all ~10 stages. If you ever want a distinct pose for, say, `confirmed` vs
`accuse`, add the file and split the alias in `src/mascot.js` — but 6 is the intended set.

---

## How it behaves once art is added

- On load and at every stage change, `src/mascot.js` sets `<img src="mascot/steely-<expr>.png">`.
- It **preloads** all six up front and only reveals one once its file is confirmed to load — so a
  missing file shows nothing (no broken-image icon), and a present one appears the moment it's ready.
- No build step, no manifest to edit, no cache-busting needed for first drop. Just add the files.
