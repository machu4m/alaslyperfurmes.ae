# Al Asly — Brand Guidelines

**الأصلي** · Dubai, United Arab Emirates
Version 1.0 · Owner: Al Asly · Source of truth for every asset in `public/brand/`

---

## 1. The idea

### 1.1 What we are

Al Asly is a Dubai perfume house that resells authentic designer and niche
fragrance. We do not make perfume. We make certainty about it.

In a market where a bottle can be refilled, rebadged, decanted, "inspired by"
or straightforwardly faked, the scarce thing is not the fragrance. It is the
proof that the fragrance is what the box says it is. That is the business we
are actually in.

### 1.2 Positioning statement

> For people in the Gulf who want a designer or niche fragrance and cannot
> afford to be wrong about it, Al Asly is the Dubai perfume house that sells
> only what it can account for — every bottle sourced through authorised
> channels, every price and every origin shown in the open.
>
> Unlike resellers who ask to be trusted, we show the paperwork.

### 1.3 The brand line

**Nothing but the original.**
**لا شيء سوى الأصل.**

The name does the work: *al-asly* means *the original*, *the authentic*, *the
source*. Everything the brand says is a restatement of its own name.

### 1.4 What we will not do

- We will not sell a bottle we cannot trace.
- We will not describe a fragrance in words the wearer would not recognise on
  their own skin.
- We will not mock the people who buy dupes. We will simply be legible about
  what we sell.
- We will not hide a price, a fee or a sourcing route behind "contact us".

### 1.5 Personality

| Trait | Means | Does not mean |
|---|---|---|
| **Accountable** | Shows provenance before being asked | Defensive, over-explaining |
| **Quietly luxurious** | Space, restraint, one gold accent | Gilded everything, crowns, crests |
| **Khaleeji by default** | Arabic is first-class, not a translation layer | Ornament borrowed as decoration |
| **Curatorial** | An edit with reasons | An endless catalogue |
| **Plainspoken** | Short sentences, real numbers | Blunt, cold, transactional |

---

## 2. Voice

### 2.1 Five rules

1. **Say the true thing first.** The headline carries the fact, not the mood.
   *"Sourced from authorised distributors in Dubai."* before *"An olfactory
   journey."*
2. **Short sentences. Generous space.** If a sentence needs a comma to
   survive, it probably needs a full stop instead.
3. **Describe the scent, not the fantasy.** Name materials, name the moment
   it suits, name how long it lasts. Skip the desert caravan.
4. **Arabic is an original, not a translation.** Arabic copy is written in
   Arabic, by someone who writes Arabic. Idioms are not carried across; the
   intent is.
5. **Never punch down.** Counterfeits are a fact we solve, not a rival we
   insult.

### 2.2 Tone by context

| Context | Tone | Example |
|---|---|---|
| Home / hero | Assured, still | *Perfume you can account for.* |
| Product page | Precise, sensory | *Amber, tonka, a dry cedar finish. Eight hours on skin, more on cloth.* |
| Authenticity page | Procedural, unhurried | *Every bottle arrives with a batch code. Here is how to read yours.* |
| WhatsApp / support | Warm, quick, first-person | *Yes — 100ml is in stock. Shall I hold one for you?* |
| Checkout | Flat and factual. No persuasion at the moment of payment. | *Cash on delivery across the UAE. You pay the courier.* |
| Journal | Curious, teacherly | *Why the same bottle smells different in July.* |
| Out of stock / bad news | Direct, then useful | *Sold out. The 50ml is the same juice — or we can message you when it lands.* |

### 2.3 Words we use / avoid

**Use:** authentic, sourced, authorised, batch, decant, sillage, notes,
original, house, edit, hold one for you, in stock, arrives.

**Avoid:** luxury (we show it, we don't claim it), exclusive, premium,
unrivalled, sensational, "elevate your", "indulge in", "unleash",
"journey", exclamation marks, ALL-CAPS SHOUTING, countdown urgency.

### 2.4 Arabic voice

- Register: **Modern Standard Arabic**, warm rather than formal. Not
  colloquial Emirati in body copy; a light Khaleeji register is fine in
  WhatsApp replies.
- Never machine-translate a headline. Arabic headlines are written short and
  benefit from *saj‘*-like balance — but never at the cost of the fact.
- Numerals: Western Arabic numerals (1, 2, 3) throughout, for price clarity
  and consistency with the checkout.
- Brand name in Arabic is always **الأصلي**, never a transliteration of
  "Al Asly".

---

## 3. The logo

### 3.1 The mark

The mark is a flacon reduced to two parts: a faceted cap and a body split by a
single hairline.

The hairline is the whole idea. It reads as the glint on cut glass, and it
reads as an **alif** — ا — the first letter of الأصلي and the first letter of
the Arabic alphabet. The original letter, in the original bottle. Seen from a
distance, the cap and body together also make a Latin **i**: the first sound
of *Asly*.

That is a real double reading, and it is the only thing about the mark that
needs explaining. Do not add anything to it.

### 3.2 Construction

Every proportion is derived from one unit: the width of the body, **56**.

| Element | Measure |
|---|---|
| Body | 56 × 177.7 — a 1 : 3.173 rectangle |
| Body corner radius | 6 (0.107 × body width) |
| Cap | a square rotated 45°, half-diagonal 28, corner radius 8 |
| Cap height | 49.37 (0.882 × body width) |
| Gap, cap to body | 10.93 (0.221 × cap height) |
| Seam | 2.3 wide (4.1% of body width), 2.4 right of the body's centre |
| Mark overall | 56 × 238 — a 1 : 4.25 rectangle |
| Logotype cap height | 55 (0.982 × body width) |
| Logotype tracking | 0.33 em |

The geometry lives in `tools/brand_geometry.py`. Every file in
`public/brand/` is generated from it by `tools/build_brand_assets.py` — so
**no asset in that folder should ever be edited by hand**. Change the
geometry, re-run the build.

### 3.3 The logotype

**Manrope SemiBold, tracked 0.33 em, all caps.** The logotype is supplied as
outlines in every logo file and is never re-set as live text in layout.

The one exception is a plain-text context where an image cannot go — an email
signature, a terminal banner, a system-generated document header. There, use
the `.asly-logotype` class (or its equivalent): Manrope SemiBold, 0.33 em
tracking, uppercase.

### 3.4 The lockups

| File | Use |
|---|---|
| `alasly-lockup-vertical` | **Primary.** Default for anything with room. 1 : 0.879 |
| `alasly-lockup-horizontal` | Site headers, email headers, wide banners. 1 : 0.288 |
| `alasly-lockup-bilingual` | Packaging, shopfront, any surface an Arabic-first customer meets first. 1 : 1.419 |
| `alasly-mark` | Avatars, favicons, stickers, as a repeating pattern |
| `alasly-mark-solid` | Anything below 24 px tall, and any single-pass process — embroidery, foil, deboss, laser etch, hot stamp |
| `alasly-wordmark` | When the mark already appears elsewhere on the surface |
| `alasly-wordmark-ar` | Arabic-only contexts |
| `alasly-seal` | Authenticity seal. Product pages, packing slips, box seals, the certificate |
| `alasly-tile` | The signature square: gold on onyx, clear space built in |

Each is supplied in three inks — `gold` (default), `-onyx`, `-ivory` — plus
`alasly-lockup-vertical-gilded` for hero and packaging, where the gold should
read as leaf rather than paint.

### 3.5 Clear space

**Clear space equals the height of the cap.** Measure the diamond; keep that
much empty on all four sides. Nothing enters it — no type, no rule, no image
edge, no other logo.

On the primary lockup that is 11.6% of the lockup's width. The `alasly-tile`
files have it built in already.

### 3.6 Minimum sizes

Governed by the logotype's stroke, which must stay at or above 2 px.

| Asset | Digital minimum | Print minimum |
|---|---|---|
| Vertical lockup | **96 px** wide (cap 12.4 px, stroke 2.0 px) | 25 mm |
| Horizontal lockup | **120 px** wide | 32 mm |
| Bilingual lockup | **120 px** wide | 32 mm |
| Mark | **24 px** tall | 8 mm |
| Mark, solid | **12 px** tall | 3 mm |
| Seal | **64 px** | 18 mm |

Below 24 px the seam in the mark stops resolving and turns to mud. Use
`alasly-mark-solid` there — that is what it is for.

### 3.7 Misuse

Do not:

1. Re-set the logotype in another face, weight or tracking.
2. Stretch, squash, skew, rotate or arc any part of the logo.
3. Recolour it outside gold, onyx and ivory. No gradients other than the
   supplied gilded file. No brand colours borrowed from a stocked house.
4. Add a shadow, glow, outline, bevel or reflection.
5. Place it on a busy photograph without a scrim. If the mark needs a scrim,
   use one at 55% onyx or darker.
6. Place gold on ivory or on any light ground — the contrast is 1.4 : 1.
   Use the `-onyx` files on light grounds.
7. Enclose it in a box, badge or circle of your own. The seal already exists.
8. Separate the cap from the body, or remove the seam from anything above
   24 px.
9. Use the mark as a letter inside a word.
10. Lock it up with another brand's logo closer than the clear space allows.

---

## 4. Colour

### 4.1 The palette

Four families. Onyx is the ground, gold is the light, champagne is the paper,
oud is the one accent.

**Onyx** — warm-neutral, never blue-black. `onyx-850` is the exact black of
the logo artwork.

| Token | Hex | Use |
|---|---|---|
| `onyx-950` | `#0b0b0b` | Type on gold |
| `onyx-900` | `#111111` | Body type on light |
| `onyx-850` | `#171717` | **The brand black.** Dark grounds |
| `onyx-800` | `#1f1e1c` | Raised surfaces on dark |
| `onyx-700` | `#2b2926` | Secondary type on light |
| `onyx-500` | `#57534b` | Muted type on light (6.9 : 1) |
| `onyx-400` | `#7b766c` | Faint type, 16 px and above only (4.1 : 1) |
| `onyx-200` | `#ccc7bd` | Muted type on dark (10.7 : 1) |
| `onyx-50` | `#f7f3ea` | Type on dark |

**Gold** — `gold-500` is the exact gold of the logo artwork.

| Token | Hex | Use |
|---|---|---|
| `gold-500` | `#f2cb58` | **The brand gold.** On dark only (11.5 : 1) |
| `gold-600` | `#d3a63b` | Focus rings, pressed state, hairlines |
| `gold-800` | `#86651c` | Gold **as type on a light ground** (4.9 : 1) |
| `gold-400` – `gold-50` | | Tints for dark-ground surfaces and washes |

**Champagne (`sand`)** — paper, packaging, dividers. `sand-50` `#fbf8f1` is
the light page ground.

**Oud** — one accent, used sparingly for state and emphasis. `oud-500`
`#752632` (9.1 : 1 on champagne).

### 4.2 The rules that matter

- **Gold is a light, not an ink.** On a dark ground it is the brightest thing
  on the page. On a light ground it is invisible. `gold-500` on `sand-50` is
  **1.4 : 1** and fails every standard there is. For gold type on light, the
  token is `gold-800`.
- **Type on a gold fill is `onyx-950`** (12.6 : 1), never white.
- **One gold per view.** Gold marks the single most important thing on a
  screen or a surface. A second gold element halves the value of the first.
- **Onyx and champagne do the work; gold and oud are punctuation.** A rough
  split: 60% ground, 30% type and structure, 8% gold, 2% oud.

### 4.3 Accessibility floor

Every combination shipped in the product meets **WCAG AA (4.5 : 1)** for body
text and **AAA (7 : 1)** wherever the type is 16 px or smaller. Verified
pairs:

| Foreground | Ground | Ratio |
|---|---|---|
| `gold-500` | `onyx-850` | 11.5 : 1 |
| `onyx-50` | `onyx-850` | 16.2 : 1 |
| `onyx-200` | `onyx-850` | 10.7 : 1 |
| `onyx-900` | `sand-50` | 17.1 : 1 |
| `onyx-500` | `sand-50` | 6.9 : 1 |
| `gold-800` | `sand-50` | 4.9 : 1 |
| `onyx-950` | `gold-500` | 12.6 : 1 |
| `oud-500` | `sand-50` | 9.1 : 1 |

`onyx-400` on `sand-50` is 4.1 : 1 — below AA. It is a decorative grey, not a
type colour. Do not use it for anything a customer has to read.

---

## 5. Typography

### 5.1 The families

| Role | Latin | Arabic |
|---|---|---|
| Logotype | Manrope SemiBold, 0.33 em | — (outlines only) |
| Display | **Playfair Display** | **Amiri** |
| Text & UI | **Manrope** | **Tajawal** |

Manrope is the logotype's own face, so the interface and the logo share a
skeleton. Playfair supplies the high-contrast serif voice a fragrance house
needs; Amiri is its naskh counterpart — a genuine Arabic original, not a
Latin face with Arabic bolted on.

All four are open-licensed (SIL OFL) and served from the app's own font
pipeline. No licence to buy, no foundry to clear.

### 5.2 Scale

A 1.200 (minor third) scale from 16 px, with three display steps above it.
Each step ships with the line height it was drawn for.

| Token | Size | Line height | Use |
|---|---|---|---|
| `6xl` | 68 px | 1.04 | Hero display |
| `5xl` | 52 px | 1.08 | Page display |
| `4xl` | 40 px | 1.14 | Section heading |
| `3xl` | 32 px | 1.20 | Subsection |
| `2xl` | 26 px | 1.30 | Card title |
| `xl` | 22 px | 1.40 | Lead paragraph |
| `lg` | 18 px | 1.60 | Long-form body |
| `base` | 16 px | 1.65 | Body |
| `sm` | 14 px | 1.55 | Secondary, captions |
| `xs` | 12 px | 1.50 | Eyebrows, labels |
| `2xs` | 11 px | 1.45 | Legal, meta |

### 5.3 Tracking

| Token | Value | Use |
|---|---|---|
| `logotype` | 0.33 em | The brand line only |
| `eyebrow` | 0.26 em | All-caps eyebrows at 12 px |
| `caps` | 0.14 em | All-caps buttons and labels at 14 px |
| `display` | −0.015 em | Display sizes, 32 px and up |
| `normal` | 0 | Everything else, and **all Arabic** |

**Arabic is never letterspaced.** Tracking breaks the joins between letters
and makes the word illegible. The global stylesheet already resets tracking
to zero under `[dir="rtl"]` for headings; keep it that way.

### 5.4 Setting rules

- Display type is set in Playfair, tight, and balanced across lines
  (`text-wrap: balance`).
- Body measure: **60–75 characters**. Arabic runs a little longer; 70–85 is
  right.
- Arabic display needs more leading than Latin, not less — 1.35 minimum.
- Never set Arabic in italics or in a faux-bold. Amiri and Tajawal ship the
  weights they ship.
- Sentence case for headings. Title Case is for the logotype and nothing else.

---

## 6. Layout, space and line

- **Space unit: 4 px.** Section rhythm: 64 / 96 / 128.
- **Measure:** 1280 px max content width, 8-column feel at desktop.
- **Radius:** taken from the mark, whose corner is 0.107 of its width — so the
  brand's corner is tight. `xs` 2 px, `sm` 4 px, `md` 8 px, `lg` 14 px.
  Nothing is rounder than 14 px except a deliberate pill.
- **Rules:** 1 px hairlines at 12% ink. The brand's divider is the
  `.asly-rule` — a hairline with a single gold cap-shaped node at its centre.
- **Elevation:** on champagne, a warm shadow. On onyx, **light, not shadow** —
  a gold rim at 22%. A dark card never casts a drop shadow.

---

## 7. Imagery

### 7.1 Product

- One bottle, centred, on onyx or champagne seamless. No props competing with
  the glass.
- Light from one side, hard enough to make an edge. Perfume is glass; glass
  needs an edge to exist.
- Shadow stays on the surface. No floating bottles.
- Every product needs one shot with the **batch code legible**. That shot is
  the brand, not an afterthought.

### 7.2 Editorial

- Material over lifestyle: resin, wood, citrus peel, paper, the box, the seal.
- Hands are allowed. Faces are rare, and never a stock-library face.
- Dubai appears as texture and light, not as a skyline postcard.

### 7.3 Treatment

- No filters, no heavy grade, no gold overlay on a photograph.
- If a photograph needs the logo on it, it needs a scrim at 55% onyx or
  darker first.

---

## 8. Motion

Nothing bounces. Things arrive and settle.

| Token | Value |
|---|---|
| `fast` | 160 ms |
| `base` | 240 ms |
| `slow` | 420 ms |
| easing | `cubic-bezier(0.22, 1, 0.36, 1)` |

- Entrances: fade with a 12 px rise. Never a scale-up.
- Hover: colour and border only. No lift, no grow.
- The mark may reveal by drawing the seam last — once, on a first load, never
  on navigation.
- All of it collapses to 0 ms under `prefers-reduced-motion`. The tokens
  already do this.

---

## 9. Applications

**Packaging.** Bilingual lockup on onyx board, gold foil. Seal on the flap.
Batch code printed, never stickered over.

**The card in the box.** Champagne stock, onyx type, one gold rule. Carries
the batch code, the source, and the line *Nothing but the original.* This card
is the product's proof; treat it as part of the product.

**Shopfront and signage.** Bilingual lockup, Arabic no smaller than the
Latin. Brushed brass or gold vinyl on dark ground.

**WhatsApp.** Avatar is `alasly-mark` on onyx. First reply always names a
person.

**Social.** Onyx grid, one gold element per post, generous margins. The
`social/og-image.png` is the default share card.

**Invoices and email.** Horizontal lockup, onyx ink on white. Seal beside the
authenticity note, not beside the total.

---

## 10. Files and how they are made

```
public/brand/
├── logo/      SVG — lockups, mark, wordmarks, seal, tiles, in gold/onyx/ivory
├── icon/      favicon.svg, small-size favicon, maskable icon, PNG app icons
├── png/       2048 px transparent PNG exports of every lockup
├── social/    og-image.png (1200×630), avatar.png (1024²)
└── README.md  which file to reach for
```

Everything in `public/brand/` is **generated**. The pipeline is:

```
tools/brand_geometry.py   the measured construction of the mark
tools/brand_type.py       outline extraction and shaping for the logotypes
tools/brand_lockups.py    how the parts compose into lockups and the seal
tools/build_brand_assets.py   writes every file in public/brand/
```

To change anything, change the geometry or the palette and run:

```bash
python3 tools/build_brand_assets.py
```

Design tokens live in **`src/styles/tokens.ts`** and are emitted both into the
Tailwind theme and onto `:root` as `--asly-*` custom properties, so the
product and any non-Tailwind CSS read the same numbers. Brand devices that
cannot be expressed as a token — the gilt fill, the logotype setting, the
gold-node rule — live in `src/styles/brand.css`.

---

## 11. Quick reference

| | |
|---|---|
| Brand black | `#171717` |
| Brand gold | `#f2cb58` |
| Page ground | `#fbf8f1` |
| Gold as type on light | `#86651c` |
| Logotype | Manrope SemiBold, 0.33 em, caps |
| Display | Playfair Display / Amiri |
| Text | Manrope / Tajawal |
| Clear space | the height of the cap |
| Minimum lockup | 96 px wide |
| Line | **Nothing but the original.** |
