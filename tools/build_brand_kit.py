#!/usr/bin/env python3
"""Build public/brand/brand-kit.html — the whole identity as one self-contained page.

    python3 tools/build_brand_kit.py

The page carries no dependencies but Google Fonts: every logo is inlined from
tools/brand_geometry.py, so the kit and the asset files can never drift.
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from string import Template  # noqa: E402

import brand_geometry as g  # noqa: E402
import brand_lockups as L  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "brand", "brand-kit.html")

# --------------------------------------------------------------- palette ---
ONYX = {950: "#0b0b0b", 900: "#111111", 850: "#171717", 800: "#1f1e1c", 700: "#2b2926",
        600: "#3d3a35", 500: "#57534b", 400: "#7b766c", 300: "#a6a197", 200: "#ccc7bd",
        100: "#e7e3da", 50: "#f7f3ea"}
GOLD = {900: "#5e4712", 800: "#86651c", 700: "#ae8427", 600: "#d3a63b", 500: "#f2cb58",
        400: "#f6d97d", 300: "#f9e5a5", 200: "#fbefc8", 100: "#fdf7e6", 50: "#fefcf5"}
SAND = {900: "#2a2315", 800: "#4e4023", 700: "#756033", 600: "#977c42", 500: "#b79a58",
        400: "#cbb379", 300: "#dccb9f", 200: "#e9dec4", 100: "#f4eee0", 50: "#fbf8f1"}
OUD = {700: "#3c1219", 600: "#571b24", 500: "#752632", 400: "#9a414c", 300: "#c0737c"}


def _lum(hex_colour: str) -> float:
    h = hex_colour.lstrip("#")
    ch = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    ch = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in ch]
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]


def ratio(a: str, b: str) -> float:
    la, lb = _lum(a), _lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def cr(a: str, b: str) -> str:
    return f"{ratio(a, b):.1f}:1"


# ------------------------------------------------------------- the logos ---
PIECES = {name: fn() for name, fn in (
    ("mark", L.mark), ("markSolid", L.mark_solid), ("wordmark", L.wordmark),
    ("wordmarkAr", lambda: L.arabic_wordmark(100.0)), ("vertical", L.lockup_vertical),
    ("horizontal", L.lockup_horizontal), ("bilingual", L.lockup_bilingual),
    ("seal", L.seal),
)}


def vb(piece) -> str:
    return " ".join(f"{v:.3f}".rstrip("0").rstrip(".") for v in piece["viewBox"])


def logo(name: str, *, width: float | None = None, height: float | None = None,
         cls: str = "", style: str = "", label: str = "") -> str:
    """Inline a lockup. It paints with currentColor, so the surrounding text
    colour is what tints it."""
    piece = PIECES[name]
    _, _, w, h = piece["viewBox"]
    r = h / w
    if width is None and height is None:
        width = 120
    if width is None:
        width = height / r
    if height is None:
        height = width * r
    a11y = (f'role="img" aria-label="{label}"' if label
            else 'role="presentation" aria-hidden="true"')
    return (f'<svg viewBox="{vb(piece)}" width="{width:.2f}" height="{height:.2f}" '
            f'fill="currentColor" class="{cls}" style="{style}" {a11y}>{piece["body"]}</svg>')


# ------------------------------------------------------------ components ---
def ramp(name: str, scale: dict, notes: dict) -> str:
    rows = []
    for step in sorted(scale, reverse=True):
        hexv = scale[step]
        on_dark = ratio(hexv, ONYX[850])
        on_light = ratio(hexv, SAND[50])
        best = max(on_dark, on_light)
        ground = "onyx" if on_dark >= on_light else "champagne"
        rows.append(
            f'<tr><td><span class="chip" style="background:{hexv}"></span>'
            f'<code>{name}-{step}</code></td>'
            f'<td><code class="hex">{hexv}</code></td>'
            f'<td class="num">{best:.1f}:1 <span class="dim">on {ground}</span></td>'
            f'<td class="use">{notes[step]}</td></tr>')
    return (f'<div class="tablewrap"><table class="ramp">'
            f'<thead><tr><th>Token</th><th>Hex</th><th>Best contrast</th><th>Where it goes</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table></div>')


ONYX_NOTES = {
    950: "Type on a gold fill. The deepest ground there is.",
    900: "Body type on champagne. Full-bleed dark bands.",
    850: "<b>The brand black</b> — the exact ground of the logo artwork.",
    800: "Raised surfaces on dark: cards, sheets, menus.",
    700: "Hover state for dark fills.",
    600: "Dark chrome — bars, quiet chips.",
    500: "Icon grey on light.",
    400: "Decorative grey only. 4.1:1 on champagne, so never body type.",
    300: "Dividers on dark photography.",
    200: "Muted type on dark grounds.",
    100: "Hairlines and wells on light.",
    50: "Type on dark. The warm off-white the system is tuned to.",
}
GOLD_NOTES = {
    900: "Gold type on a gold tint.",
    800: "<b>Gold as type on a light ground.</b>",
    700: "Gold icons and rules on light where 3:1 is enough.",
    600: "Pressed state on gold fills; hairlines on dark.",
    500: "<b>The brand gold</b> — the exact gold of the artwork. Fills, and type on dark only.",
    400: "Hover state on gold fills.",
    300: "Gold on dark at display sizes; the highlight in the gilt.",
    200: "Gold washes and tinted dark surfaces.",
    100: "Gold tint on light — a highlighted row, a soft badge.",
    50: "The faintest gold wash, for a whole section ground.",
}
SAND_NOTES = {
    900: "Champagne at full depth — type on a champagne fill.",
    800: "Deep champagne for packaging and print.",
    700: "Champagne type on the page ground.",
    600: "Champagne icons and rules.",
    500: "The middle of the scale — packaging, dividers.",
    400: "Champagne fills; product-image placeholders.",
    300: "Quiet fills and photographic backdrops.",
    200: "Card grounds and print stock.",
    100: "Wells, table stripes, the quiet section.",
    50: "<b>The page ground.</b> Warm paper, never white.",
}
OUD_NOTES = {
    700: "Oud at its deepest — type on champagne.",
    600: "Pressed state on oud fills.",
    500: "The oud accent on light.",
    400: "Oud fills and borders.",
    300: "The oud accent on dark.",
}


def build() -> str:
    lockups = [
        ("Vertical", "vertical", "Primary. Anything with room.", 186, "96&nbsp;px wide"),
        ("Horizontal", "horizontal", "Site and email headers, wide banners.", 236, "120&nbsp;px wide"),
        ("Bilingual", "bilingual", "Packaging, shopfront, Arabic-first surfaces.", 132, "120&nbsp;px wide"),
        ("Mark", "mark", "Avatars, badges, favicons, repeating pattern.", None, "24&nbsp;px tall"),
        ("Mark, solid", "markSolid", "Below 24&nbsp;px. Embroidery, foil, deboss, etch.", None, "12&nbsp;px tall"),
        ("Wordmark", "wordmark", "When the mark is already on the surface.", 186, "90&nbsp;px wide"),
        ("Wordmark, Arabic", "wordmarkAr", "Arabic-only contexts.", 150, "56&nbsp;px wide"),
        ("Seal", "seal", "Product pages, packing slips, box seals.", 116, "64&nbsp;px"),
    ]
    lockup_cards = ""
    for title, key, use, w, minimum in lockups:
        art = (logo(key, height=120) if w is None else logo(key, width=w))
        lockup_cards += (
            f'<figure class="lockup">'
            f'<div class="lockup__art">{art}</div>'
            f'<figcaption><h4>{title}</h4><p>{use}</p>'
            f'<p class="dim">Minimum {minimum}</p></figcaption></figure>')

    # ---- construction diagram ------------------------------------------
    S = 1.55  # scale the 56-unit mark up for the drawing
    mw, mh = g.MARK_W * S, g.MARK_H * S
    padl, padr, padt, padb = 150, 150, 40, 58
    dw, dh = mw + padl + padr, mh + padt + padb
    cap_h = g.CAP_D * 2 - 2 * g.CAP_R * (2 ** 0.5 - 1)
    construction = f'''
<svg class="diagram diagram--mark" viewBox="0 0 {dw:.1f} {dh:.1f}" role="img"
     aria-label="The mark drawn on its construction grid: body 56 by 177.7, cap half-diagonal 28, seam 2.3 wide.">
  <g transform="translate({padl} {padt}) scale({S})">
    <path d="{g.mark_path()}" fill="currentColor" opacity="0.9"/>
  </g>
  <g class="dim-line" transform="translate({padl} {padt})">
    <!-- body width -->
    <line x1="0" y1="{mh + 22:.1f}" x2="{mw:.1f}" y2="{mh + 22:.1f}"/>
    <line x1="0" y1="{mh + 16:.1f}" x2="0" y2="{mh + 28:.1f}"/>
    <line x1="{mw:.1f}" y1="{mh + 16:.1f}" x2="{mw:.1f}" y2="{mh + 28:.1f}"/>
    <text x="{mw / 2:.1f}" y="{mh + 42:.1f}" text-anchor="middle">56 — the master unit</text>
    <!-- cap height -->
    <line x1="{mw + 26:.1f}" y1="0" x2="{mw + 26:.1f}" y2="{cap_h * S:.1f}"/>
    <line x1="{mw + 20:.1f}" y1="0" x2="{mw + 32:.1f}" y2="0"/>
    <line x1="{mw + 20:.1f}" y1="{cap_h * S:.1f}" x2="{mw + 32:.1f}" y2="{cap_h * S:.1f}"/>
    <text x="{mw + 40:.1f}" y="{cap_h * S / 2 + 4:.1f}">49.37 cap</text>
    <!-- gap -->
    <line x1="{mw + 26:.1f}" y1="{cap_h * S:.1f}" x2="{mw + 26:.1f}" y2="{g.BOTTLE_TOP * S:.1f}"/>
    <text x="{mw + 40:.1f}" y="{(cap_h + g.BOTTLE_TOP) / 2 * S + 4:.1f}">10.93 gap</text>
    <!-- body height -->
    <line x1="{mw + 26:.1f}" y1="{g.BOTTLE_TOP * S:.1f}" x2="{mw + 26:.1f}" y2="{mh:.1f}"/>
    <line x1="{mw + 20:.1f}" y1="{mh:.1f}" x2="{mw + 32:.1f}" y2="{mh:.1f}"/>
    <text x="{mw + 40:.1f}" y="{(g.BOTTLE_TOP * S + mh) / 2 + 4:.1f}">177.7 body</text>
    <!-- seam callout -->
    <line class="lead" x1="{g.SEAM_X * S:.1f}" y1="{140 * S:.1f}" x2="-26" y2="{140 * S:.1f}"/>
    <text x="-32" y="{140 * S + 4:.1f}" text-anchor="end">seam 2.3</text>
    <!-- radius callouts -->
    <line class="lead" x1="{8 * S:.1f}" y1="{24 * S:.1f}" x2="-26" y2="{24 * S:.1f}"/>
    <text x="-32" y="{24 * S + 4:.1f}" text-anchor="end">cap r8</text>
    <line class="lead" x1="{4 * S:.1f}" y1="{232 * S:.1f}" x2="-26" y2="{232 * S:.1f}"/>
    <text x="-32" y="{232 * S + 4:.1f}" text-anchor="end">body r6</text>
  </g>
</svg>'''

    # ---- clear space diagram -------------------------------------------
    vpiece = PIECES["vertical"]
    vx, vy, vw, vh = vpiece["viewBox"]
    clear = cap_h
    clearspace = f'''
<svg class="diagram" viewBox="{vx - clear * 2:.1f} {vy - clear * 2:.1f} {vw + clear * 4:.1f} {vh + clear * 4:.1f}"
     role="img" aria-label="The primary lockup with a clear-space margin equal to the cap's height on all four sides.">
  <rect x="{vx - clear * 2:.1f}" y="{vy - clear * 2:.1f}" width="{vw + clear * 4:.1f}" height="{vh + clear * 4:.1f}"
        class="cs-outer"/>
  <rect x="{vx - clear:.1f}" y="{vy - clear:.1f}" width="{vw + clear * 2:.1f}" height="{vh + clear * 2:.1f}"
        class="cs-inner"/>
  <g fill="currentColor">{vpiece["body"]}</g>
  <g class="cs-mark">
    <rect x="{vx - clear:.1f}" y="{vy - clear:.1f}" width="{clear:.1f}" height="{clear:.1f}"/>
    <rect x="{vx + vw:.1f}" y="{vy + vh:.1f}" width="{clear:.1f}" height="{clear:.1f}"/>
  </g>
  <g class="cs-cap">
    <rect x="{vx - clear / 2 - clear * 0.17:.1f}" y="{vy - clear / 2 - clear * 0.17:.1f}"
          width="{clear * 0.34:.1f}" height="{clear * 0.34:.1f}"
          transform="rotate(45 {vx - clear / 2:.1f} {vy - clear / 2:.1f})" rx="2"/>
    <rect x="{vx + vw + clear / 2 - clear * 0.17:.1f}" y="{vy + vh + clear / 2 - clear * 0.17:.1f}"
          width="{clear * 0.34:.1f}" height="{clear * 0.34:.1f}"
          transform="rotate(45 {vx + vw + clear / 2:.1f} {vy + vh + clear / 2:.1f})" rx="2"/>
  </g>
</svg>'''

    # ---- misuse tiles ---------------------------------------------------
    misuses = [
        ("Don't stretch it", f'<div class="bad__art" style="color:var(--gold)">{logo("vertical", width=150, style="transform:scaleX(1.45);transform-origin:center")}</div>'),
        ("Don't rotate it", f'<div class="bad__art" style="color:var(--gold)">{logo("vertical", width=118, style="transform:rotate(-14deg)")}</div>'),
        ("Don't put gold on light", f'<div class="bad__art bad__art--light" style="color:{GOLD[500]}">{logo("vertical", width=118)}</div>'),
        ("Don't recolour it", f'<div class="bad__art" style="color:#4f86c6">{logo("vertical", width=118)}</div>'),
        ("Don't add a shadow or glow", f'<div class="bad__art" style="color:var(--gold);filter:drop-shadow(0 0 14px rgba(242,203,88,.85))">{logo("vertical", width=118)}</div>'),
        ("Don't box it", f'<div class="bad__art" style="color:var(--gold)"><span class="bad-box">{logo("vertical", width=104)}</span></div>'),
        ("Don't re-set the logotype", '<div class="bad__art"><span class="bad-type">AL&nbsp;ASLY</span></div>'),
        ("Don't use the hairline mark below 24&nbsp;px", f'<div class="bad__art" style="color:var(--gold)">{logo("mark", height=18)}<span class="bad-note">18&nbsp;px</span></div>'),
    ]
    misuse_tiles = "".join(
        f'<figure class="bad"><span class="bad__x" aria-hidden="true"></span>{art}'
        f'<figcaption>{title}</figcaption></figure>' for title, art in misuses)

    # ---- type specimens --------------------------------------------------
    scale_rows = [
        ("display-hero", "68 / 1.04", "display", "Hero display", "Nothing but the original."),
        ("display-page", "52 / 1.08", "display", "Page titles", "How we keep this honest"),
        ("display-section", "40 / 1.14", "display", "Section headings", "Direct from authorised dealers"),
        ("display-sub", "32 / 1.20", "display", "Subsections", "Why the same bottle smells different in July"),
        ("title", "26 / 1.30", "body600", "Card and product titles", "Oud Satin Mood"),
        ("lead", "22 / 1.40", "body", "The paragraph under a heading", "Sourced from authorised distributors in Dubai."),
        ("body-long", "18 / 1.60", "body", "Journal and long-form", "Amber, tonka, a dry cedar finish."),
        ("body", "16 / 1.65", "body", "Default body copy", "Eight hours on skin, more on cloth."),
        ("body-sm", "14 / 1.55", "body", "Captions, table cells", "Cash on delivery across the UAE."),
        ("meta", "11 / 1.45", "body", "Legal and metadata", "Batch 4A21 · imported 03/2026"),
    ]
    scale_html = "".join(
        f'<div class="spec"><div class="spec__meta"><code>{tok}</code>'
        f'<span class="dim">{size}</span><span class="dim">{use}</span></div>'
        f'<div class="spec__sample sp-{tok}">{sample}</div></div>'
        for tok, size, _fam, use, sample in scale_rows)

    contrast_rows = [
        ("gold-500", GOLD[500], "onyx-850", ONYX[850], "Gold type and the logo on the brand black"),
        ("onyx-50", ONYX[50], "onyx-850", ONYX[850], "Body type on dark"),
        ("onyx-200", ONYX[200], "onyx-850", ONYX[850], "Muted type on dark"),
        ("onyx-900", ONYX[900], "sand-50", SAND[50], "Body type on the page"),
        ("#4a463f", "#4a463f", "sand-50", SAND[50], "Muted type on the page"),
        ("#6b665d", "#6b665d", "sand-50", SAND[50], "The quietest readable type"),
        ("gold-800", GOLD[800], "sand-50", SAND[50], "Gold <em>as type</em> on light"),
        ("onyx-950", ONYX[950], "gold-500", GOLD[500], "Type on a gold fill"),
        ("oud-500", OUD[500], "sand-50", SAND[50], "The oud accent on light"),
        ("oud-300", OUD[300], "onyx-850", ONYX[850], "The oud accent on dark"),
        ("#8d887e", "#8d887e", "sand-50", SAND[50], "Input borders on light (needs 3:1)"),
        ("gold-600", GOLD[600], "sand-50", SAND[50], "Rejected as a focus ring — below 3:1"),
    ]
    contrast_html = ""
    for fg_name, fg, bg_name, bg, use in contrast_rows:
        r = ratio(fg, bg)
        need = 3.0 if "3:1" in use or "focus" in use or "border" in use else 4.5
        ok = r >= need
        verdict = ("AAA" if r >= 7 else "AA") if ok else "FAILS"
        cls = "pass" if ok else "fail"
        contrast_html += (
            f'<tr><td><span class="pair" style="background:{bg};color:{fg}">Aa</span>'
            f'<code>{fg_name}</code> <span class="dim">on</span> <code>{bg_name}</code></td>'
            f'<td class="num">{r:.1f}:1</td>'
            f'<td><span class="verdict {cls}">{verdict}</span></td>'
            f'<td class="use">{use}</td></tr>')

    return Template(PAGE).substitute(
        lockup_cards=lockup_cards,
        construction=construction,
        clearspace=clearspace,
        misuse_tiles=misuse_tiles,
        onyx_ramp=ramp("onyx", ONYX, ONYX_NOTES),
        gold_ramp=ramp("gold", GOLD, GOLD_NOTES),
        sand_ramp=ramp("sand", SAND, SAND_NOTES),
        oud_ramp=ramp("oud", OUD, OUD_NOTES),
        contrast=contrast_html,
        scale=scale_html,
        masthead=logo("vertical", width=210, label="Al Asly"),
        nav_mark=logo("markSolid", height=26),
        mark_big=logo("mark", height=260),
        seal_big=logo("seal", width=168, label="Al Asly authenticity seal"),
        horiz=logo("horizontal", width=300),
        pcard_mark=logo("markSolid", height=44),
        pcard_mark2=logo("markSolid", height=44),
        footer_mark=logo("markSolid", height=30),
        bilingual=logo("bilingual", width=150),
        gold_on_dark=cr(GOLD[500], ONYX[850]),
        gold_on_light=cr(GOLD[500], SAND[50]),
        gold800_on_light=cr(GOLD[800], SAND[50]),
        onyx_on_gold=cr(ONYX[950], GOLD[500]),
    )


PAGE = r"""<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Al Asly Brand Book</title>
<meta name="description" content="The Al Asly identity: the idea, the voice, the logo system, colour, typography and components for the Dubai perfume house.">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#111111">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Manrope:wght@400;500;600;800&family=Playfair+Display:ital,wght@0,400..700;1,400&family=Tajawal:wght@400;700&display=swap">
<style>
/* ===========================================================================
   Al Asly brand book.
   The page commits to the brand's own world — onyx and gold — rather than
   following the viewer's theme, and paints every colour explicitly. The light
   half of the system is shown inside champagne specimen panels.
   Generated by tools/build_brand_kit.py. Do not edit by hand.
   ======================================================================== */

:root {
  --onyx-950:#0b0b0b; --onyx-900:#111111; --onyx-850:#171717; --onyx-800:#1f1e1c;
  --onyx-700:#2b2926; --onyx-600:#3d3a35; --onyx-500:#57534b; --onyx-400:#7b766c;
  --onyx-300:#a6a197; --onyx-200:#ccc7bd; --onyx-100:#e7e3da; --onyx-50:#f7f3ea;
  --gold:#f2cb58; --gold-400:#f6d97d; --gold-600:#d3a63b; --gold-800:#86651c;
  --sand-50:#fbf8f1; --sand-100:#f4eee0; --sand-200:#e9dec4; --sand-500:#b79a58;
  --oud:#c0737c; --oud-500:#752632;

  --ground:var(--onyx-900);
  --raised:var(--onyx-850);
  --ink:var(--onyx-50);
  --ink-muted:#bab5ab;      /* 8.8:1 on the brand black */
  --ink-subtle:#938e84;     /* 5.5:1 — the floor for readable type */
  --line:rgb(247 243 234 / .11);
  --line-strong:rgb(247 243 234 / .2);

  --display:"Playfair Display", Georgia, serif;
  --body:"Manrope", ui-sans-serif, system-ui, sans-serif;
  --display-ar:"Amiri", Georgia, serif;
  --body-ar:"Tajawal", ui-sans-serif, sans-serif;

  --gutter:clamp(20px, 5vw, 64px);
  --measure:66ch;
  --ease:cubic-bezier(.22,1,.36,1);
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; scroll-padding-top: 88px; }

body {
  margin: 0;
  background: var(--ground);
  color: var(--ink);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img, svg { max-width: 100%; }
svg { display: block; }

a { color: var(--gold); text-decoration-color: rgb(242 203 88 / .4); text-underline-offset: 3px; }
a:hover { text-decoration-color: var(--gold); }

:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 2px; }

code {
  font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace;
  font-size: .86em;
  color: var(--gold-400);
  background: rgb(242 203 88 / .08);
  padding: .1em .38em;
  border-radius: 3px;
  white-space: nowrap;
}

b, strong { font-weight: 600; color: var(--onyx-50); }
em { font-style: italic; }

/* ---------------------------------------------------------------- shell -- */
.shell { display: block; }

@media (min-width: 1040px) {
  .shell {
    display: grid;
    grid-template-columns: 236px minmax(0, 1fr);
    align-items: start;
  }
}

/* ------------------------------------------------------------------ nav -- */
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgb(17 17 17 / .92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  padding: 12px var(--gutter);
  padding-top: calc(12px + env(safe-area-inset-top, 0px));
}

.nav__brand { display: flex; align-items: center; gap: 12px; color: var(--gold); }
.nav__brand span {
  font-weight: 600; font-size: 12px; letter-spacing: .26em;
  text-transform: uppercase; color: var(--onyx-200);
}

.nav__list {
  display: flex; gap: 18px; margin: 10px 0 0; padding: 0 0 2px;
  list-style: none; overflow-x: auto; scrollbar-width: none;
}
.nav__list::-webkit-scrollbar { display: none; }
.nav__list a {
  display: block; white-space: nowrap; font-size: 13px; font-weight: 500;
  color: var(--ink-muted); text-decoration: none; padding: 4px 0;
  border-bottom: 1px solid transparent; transition: color .16s var(--ease), border-color .16s var(--ease);
}
.nav__list a:hover { color: var(--gold); border-bottom-color: var(--gold); }

@media (min-width: 1040px) {
  .nav {
    position: sticky; top: 0; height: 100vh; border-bottom: 0;
    border-right: 1px solid var(--line);
    padding: 40px 24px 40px var(--gutter);
    display: flex; flex-direction: column; gap: 28px;
    overflow-y: auto;
  }
  .nav__list { flex-direction: column; gap: 2px; margin: 0; overflow: visible; }
  .nav__list a { border-bottom: 0; border-left: 1px solid var(--line); padding: 6px 0 6px 14px; }
  .nav__list a:hover { border-left-color: var(--gold); border-bottom-color: transparent; }
}

/* ----------------------------------------------------------------- main -- */
main { min-width: 0; }

section {
  padding: clamp(56px, 8vw, 104px) var(--gutter);
  border-bottom: 1px solid var(--line);
}

section > * { max-width: 1080px; }

.eyebrow {
  margin: 0 0 14px;
  font-size: 12px; font-weight: 600; letter-spacing: .26em;
  text-transform: uppercase; color: var(--gold);
}

h1, h2, h3, h4 { font-family: var(--display); font-weight: 500; letter-spacing: -.015em; text-wrap: balance; margin: 0; }
h2 { font-size: clamp(30px, 4.4vw, 44px); line-height: 1.12; }
h3 { font-size: clamp(22px, 2.8vw, 28px); line-height: 1.2; margin: 52px 0 14px; }
h4 { font-family: var(--body); font-weight: 600; font-size: 15px; letter-spacing: 0; line-height: 1.35; margin: 0 0 4px; }

p { margin: 0 0 16px; max-width: var(--measure); text-wrap: pretty; }
p:last-child { margin-bottom: 0; }

.lede { font-size: clamp(17px, 2vw, 20px); line-height: 1.55; color: var(--ink-muted); }
.dim { color: var(--ink-subtle); }
.note { font-size: 14px; color: var(--ink-subtle); }

ul, ol { max-width: var(--measure); padding-left: 1.15em; margin: 0 0 16px; }
li { margin-bottom: 8px; }
li::marker { color: var(--gold-600); }

blockquote {
  margin: 0 0 22px; padding: 22px 26px;
  border-left: 2px solid var(--gold);
  background: rgb(242 203 88 / .05);
  border-radius: 0 6px 6px 0;
  font-family: var(--display); font-size: clamp(18px, 2.2vw, 21px); line-height: 1.5;
  color: var(--onyx-50); max-width: var(--measure);
}
blockquote p { margin-bottom: 12px; font-size: inherit; }

hr.rule {
  position: relative; height: 1px; border: 0; background: var(--line-strong);
  margin: 44px 0; max-width: 560px;
}
hr.rule::after {
  content: ""; position: absolute; left: 50%; top: 50%;
  width: 6px; height: 6px; translate: -50% -50%; rotate: 45deg; background: var(--gold);
}

/* ------------------------------------------------------------ masthead -- */
.masthead {
  border-bottom: 1px solid var(--line);
  padding: clamp(60px, 11vw, 132px) var(--gutter) clamp(48px, 8vw, 88px);
  background:
    radial-gradient(120% 90% at 78% 8%, rgb(242 203 88 / .09), transparent 62%),
    var(--onyx-850);
}
.masthead__logo { color: var(--gold); margin-bottom: 40px; }
.masthead h1 { font-size: clamp(38px, 7vw, 76px); line-height: 1.02; }
.masthead .ar {
  font-family: var(--display-ar); font-size: clamp(26px, 4.4vw, 44px);
  color: var(--gold); margin: 10px 0 0; direction: rtl; line-height: 1.4;
}
.masthead__meta {
  display: flex; flex-wrap: wrap; gap: 10px 26px; margin-top: 34px;
  font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
  font-weight: 600; color: var(--ink-subtle);
}

/* --------------------------------------------------------------- tables -- */
.tablewrap { overflow-x: auto; margin: 0 0 22px; max-width: 100%; }
table { border-collapse: collapse; width: 100%; min-width: 560px; font-size: 14px; }
th, td { text-align: left; padding: 11px 14px 11px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
th {
  font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  font-weight: 600; color: var(--ink-subtle); border-bottom-color: var(--line-strong);
}
td.use { color: var(--ink-muted); }
td.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
.chip {
  display: inline-block; width: 16px; height: 16px; border-radius: 3px;
  margin-right: 10px; vertical-align: -3px; box-shadow: inset 0 0 0 1px rgb(247 243 234 / .18);
}
code.hex { text-transform: uppercase; }
.pair {
  display: inline-grid; place-items: center; width: 34px; height: 24px;
  border-radius: 3px; margin-right: 10px; vertical-align: -6px;
  font-family: var(--display); font-size: 13px;
  box-shadow: inset 0 0 0 1px rgb(247 243 234 / .14);
}
.verdict {
  display: inline-block; padding: 1px 8px; border-radius: 3px;
  font-size: 11px; font-weight: 600; letter-spacing: .1em;
}
.verdict.pass { background: rgb(242 203 88 / .14); color: var(--gold); }
.verdict.fail { background: rgb(192 115 124 / .18); color: var(--oud); }

/* ---------------------------------------------------------------- grids -- */
.grid { display: grid; gap: 20px; margin: 26px 0 0; }
.grid--2 { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.grid--3 { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
.grid--4 { grid-template-columns: repeat(auto-fit, minmax(168px, 1fr)); }

.card {
  padding: 22px; border: 1px solid var(--line); border-radius: 8px;
  background: var(--raised);
}
.card h4 { color: var(--gold); margin-bottom: 8px; }
.card p { font-size: 14px; color: var(--ink-muted); margin: 0; }

/* -------------------------------------------------------------- lockups -- */
.lockup {
  margin: 0; border: 1px solid var(--line); border-radius: 8px;
  background: var(--onyx-850); overflow: hidden;
  display: flex; flex-direction: column;
}
.lockup__art {
  display: grid; place-items: center; padding: 34px 20px; min-height: 196px;
  color: var(--gold);
  background:
    linear-gradient(rgb(242 203 88 / .035), transparent 70%), var(--onyx-850);
}
.lockup figcaption { padding: 16px 20px 20px; border-top: 1px solid var(--line); }
.lockup figcaption p { font-size: 13px; color: var(--ink-muted); margin: 0; }
.lockup figcaption p.dim { margin-top: 6px; font-size: 12px; }

/* ------------------------------------------------------------ diagrams -- */
.diagram { color: var(--gold); width: 100%; height: auto; margin: 8px auto 4px; }
.diagram--mark { max-width: 430px; }
.diagram text {
  font-family: var(--body); font-size: 11px; font-weight: 600;
  fill: var(--ink-muted); letter-spacing: .04em;
}
.diagram text.sub { font-weight: 400; fill: var(--ink-subtle); }
.dim-line line { stroke: rgb(247 243 234 / .34); stroke-width: 1; }
.dim-line line.lead { stroke: rgb(242 203 88 / .5); stroke-dasharray: 3 3; }

.cs-outer { fill: rgb(242 203 88 / .045); }
.cs-inner { fill: none; stroke: var(--gold-600); stroke-width: 2.2; stroke-dasharray: 9 7; }
.cs-mark rect { fill: rgb(242 203 88 / .16); }
.cs-cap rect { fill: var(--gold); }

.diagram-frame {
  border: 1px solid var(--line); border-radius: 8px; background: var(--onyx-850);
  padding: clamp(20px, 4vw, 40px); margin: 26px 0 0;
}

/* --------------------------------------------------------------- misuse -- */
.bad {
  position: relative; margin: 0; border-radius: 8px; overflow: hidden;
  border: 1px solid rgb(192 115 124 / .3); background: var(--onyx-850);
}
.bad__art {
  display: grid; place-items: center; gap: 6px; min-height: 172px; padding: 20px;
  overflow: hidden;
}
.bad__art--light { background: var(--sand-50); }
.bad__x {
  position: absolute; top: 12px; right: 12px; width: 22px; height: 22px;
  border-radius: 50%; background: rgb(192 115 124 / .2); z-index: 2;
}
.bad__x::before, .bad__x::after {
  content: ""; position: absolute; left: 5px; top: 10.5px; width: 12px; height: 1.5px;
  background: var(--oud);
}
.bad__x::before { rotate: 45deg; }
.bad__x::after { rotate: -45deg; }
.bad figcaption {
  padding: 13px 16px; border-top: 1px solid rgb(192 115 124 / .22);
  font-size: 13px; font-weight: 500; color: var(--ink-muted);
}
.bad-box { display: block; padding: 14px 18px; border: 2px solid var(--gold); border-radius: 12px; }
.bad-type {
  font-family: var(--display); font-weight: 700; font-size: 26px;
  letter-spacing: .1em; color: var(--gold);
}
.bad-note { font-size: 11px; color: var(--ink-subtle); letter-spacing: .1em; }

/* ----------------------------------------------------------- specimens -- */
.spec {
  display: grid; gap: 6px 28px; padding: 20px 0; border-bottom: 1px solid var(--line);
  align-items: baseline;
}
@media (min-width: 760px) { .spec { grid-template-columns: 186px minmax(0, 1fr); } }
.spec__meta { display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
.spec__meta code { align-self: flex-start; }
.spec__sample { color: var(--onyx-50); min-width: 0; overflow-wrap: break-word; }

.sp-display-hero { font-family: var(--display); font-size: clamp(38px, 6vw, 68px); line-height: 1.04; letter-spacing: -.015em; }
.sp-display-page { font-family: var(--display); font-size: clamp(32px, 4.8vw, 52px); line-height: 1.08; letter-spacing: -.015em; }
.sp-display-section { font-family: var(--display); font-size: clamp(27px, 3.6vw, 40px); line-height: 1.14; letter-spacing: -.015em; }
.sp-display-sub { font-family: var(--display); font-size: clamp(23px, 2.9vw, 32px); line-height: 1.2; letter-spacing: -.015em; }
.sp-title { font-size: 26px; font-weight: 600; line-height: 1.3; }
.sp-lead { font-size: 22px; line-height: 1.4; }
.sp-body-long { font-size: 18px; line-height: 1.6; }
.sp-body { font-size: 16px; line-height: 1.65; }
.sp-body-sm { font-size: 14px; line-height: 1.55; }
.sp-meta { font-size: 11px; line-height: 1.45; font-variant-numeric: tabular-nums; }

.families { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); margin: 26px 0 0; }
.family { padding: 24px; border: 1px solid var(--line); border-radius: 8px; background: var(--onyx-850); }
.family__glyphs { font-size: 46px; line-height: 1.15; color: var(--gold); margin-bottom: 12px; }
.family__name { font-size: 15px; font-weight: 600; color: var(--onyx-50); }
.family__role { font-size: 13px; color: var(--ink-subtle); }
.f-display .family__glyphs { font-family: var(--display); }
.f-body .family__glyphs { font-family: var(--body); font-weight: 600; }
.f-display-ar .family__glyphs { font-family: var(--display-ar); direction: rtl; }
.f-body-ar .family__glyphs { font-family: var(--body-ar); font-weight: 700; direction: rtl; }

/* ---------------------------------------------------------- components -- */
.panel {
  border: 1px solid var(--line); border-radius: 10px; overflow: hidden;
  margin: 26px 0 0; background: var(--onyx-850);
}
.panel__head {
  display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: baseline;
  padding: 14px 20px; border-bottom: 1px solid var(--line);
}
.panel__head h4 { color: var(--onyx-50); }
.panel__head span { font-size: 13px; color: var(--ink-subtle); }
.panel__body { padding: clamp(22px, 4vw, 34px) clamp(20px, 4vw, 30px); display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.panel__body--light { background: var(--sand-50); color: #111111; }
.panel__body--stack { flex-direction: column; align-items: stretch; gap: 22px; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 24px; border: 1px solid transparent; border-radius: 4px;
  font-family: var(--body); font-size: 14px; font-weight: 600; line-height: 1.2;
  letter-spacing: .14em; text-transform: uppercase; cursor: pointer;
  transition: background-color .16s var(--ease), border-color .16s var(--ease);
}
.btn--gold { background: var(--gold); color: var(--onyx-950); }
.btn--gold:hover { background: var(--gold-400); }
.btn--onyx { background: var(--onyx-850); color: var(--onyx-50); }
.btn--onyx:hover { background: var(--onyx-700); }
.btn--ghost { border-color: #8d887e; color: #111111; background: transparent; }
.btn--ghost:hover { border-color: #111111; }
.btn[disabled] { opacity: .45; cursor: not-allowed; }

.surface-demo { padding: 22px; border-radius: 8px; flex: 1 1 210px; min-width: 200px; }
.surface-demo h5 { font-family: var(--display); font-size: 19px; font-weight: 500; margin: 0 0 6px; }
.surface-demo p { font-size: 13px; line-height: 1.5; margin: 0; }
.s-paper { background: #ffffff; color: #111111; border: 1px solid rgb(23 23 23 / .1); box-shadow: 0 1px 2px rgb(42 35 21 / .06); }
.s-paper p { color: #4a463f; }
.s-pane { background: var(--onyx-800); color: var(--onyx-50); border: 1px solid rgb(247 243 234 / .12); }
.s-pane p { color: var(--onyx-200); }
.s-proof { background: var(--onyx-850); color: var(--onyx-50); border: 1px solid rgb(242 203 88 / .38); box-shadow: 0 0 0 1px rgb(242 203 88 / .22), 0 12px 40px -18px rgb(242 203 88 / .5); }
.s-proof p { color: var(--onyx-200); }

.pcard { width: 220px; max-width: 100%; display: flex; flex-direction: column; gap: 14px; }
.pcard__frame {
  position: relative; aspect-ratio: 4 / 5; border-radius: 8px; background: var(--sand-200);
  display: grid; place-items: center; color: var(--sand-500); overflow: hidden;
}
.pcard__badge {
  position: absolute; top: 12px; left: 12px; padding: 3px 8px; border-radius: 2px;
  background: var(--onyx-850); color: var(--gold);
  font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
}
.pcard__house { font-size: 12px; font-weight: 600; letter-spacing: .26em; text-transform: uppercase; color: #6b665d; margin: 0; }
.pcard__name { font-family: var(--display); font-size: 22px; font-weight: 500; letter-spacing: -.015em; margin: 2px 0 0; color: #111111; }
.pcard__row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-top: 8px; }
.pcard__size { font-size: 14px; color: #4a463f; }
.pcard__price { font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums; color: #111111; }

.notes { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.notes__tier { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 16px; align-items: baseline; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
.notes__tier:last-child { border-bottom: 0; padding-bottom: 0; }
.notes__label { font-size: 12px; font-weight: 600; letter-spacing: .26em; text-transform: uppercase; color: var(--gold); }
.notes__list { display: flex; flex-wrap: wrap; gap: 8px 18px; margin: 0; padding: 0; list-style: none; }
.notes__list li { margin: 0; font-family: var(--display); font-size: 20px; color: var(--onyx-50); }

.field { display: flex; flex-direction: column; gap: 8px; width: 300px; max-width: 100%; }
.field label { font-size: 14px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #4a463f; }
.field input {
  padding: 12px 16px; border: 1px solid #8d887e; border-radius: 4px;
  background: #ffffff; color: #111111; font-family: var(--body); font-size: 16px;
}
.field input::placeholder { color: #6b665d; }
.field input:focus-visible { outline: 2px solid var(--gold-800); outline-offset: 2px; border-color: var(--gold-800); }
.field .help { font-size: 14px; color: #4a463f; margin: 0; }
.field--error input { border-color: var(--oud-500); }
.field--error .help { color: var(--oud-500); }

.swatch-strip { display: flex; flex-wrap: wrap; gap: 0; border-radius: 8px; overflow: hidden; margin: 26px 0 0; }
.swatch-strip div { flex: 1 1 96px; height: 92px; display: grid; align-content: end; padding: 10px; font-size: 11px; font-weight: 600; letter-spacing: .08em; }

.motion-demo { display: flex; flex-wrap: wrap; gap: 14px; }
.motion-demo span {
  padding: 10px 18px; border: 1px solid var(--line); border-radius: 4px;
  font-size: 13px; color: var(--ink-muted); background: var(--onyx-800);
  transition: color var(--d) var(--ease), border-color var(--d) var(--ease);
}
.motion-demo span:hover { color: var(--gold); border-color: rgb(242 203 88 / .45); }

/* --------------------------------------------------------------- footer -- */
footer {
  padding: clamp(48px, 7vw, 80px) var(--gutter);
  padding-bottom: calc(clamp(48px, 7vw, 80px) + env(safe-area-inset-bottom, 0px));
  color: var(--ink-subtle); font-size: 13px;
}
footer .mark { color: var(--gold-600); margin-bottom: 20px; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
</style>
</head>
<body>
<div class="shell">

<nav class="nav" aria-label="Sections">
  <div class="nav__brand">${nav_mark}<span>Brand book</span></div>
  <ul class="nav__list">
    <li><a href="#idea">The idea</a></li>
    <li><a href="#voice">Voice</a></li>
    <li><a href="#logo">The logo</a></li>
    <li><a href="#construction">Construction</a></li>
    <li><a href="#clearspace">Clear space</a></li>
    <li><a href="#misuse">Misuse</a></li>
    <li><a href="#colour">Colour</a></li>
    <li><a href="#type">Typography</a></li>
    <li><a href="#space">Space &amp; line</a></li>
    <li><a href="#motion">Motion</a></li>
    <li><a href="#components">Components</a></li>
    <li><a href="#applications">Applications</a></li>
    <li><a href="#files">Files</a></li>
  </ul>
</nav>

<main>

<header class="masthead">
  <div class="masthead__logo">${masthead}</div>
  <h1>Nothing but the original.</h1>
  <p class="ar">لا شيء سوى الأصل.</p>
  <div class="masthead__meta">
    <span>Al Asly · الأصلي</span>
    <span>Dubai, UAE</span>
    <span>Brand book v1.0</span>
  </div>
</header>

<!-- ============================================================ idea == -->
<section id="idea">
  <p class="eyebrow">The idea</p>
  <h2>We do not make perfume. We make certainty about it.</h2>
  <p class="lede">Al Asly is a Dubai perfume house that resells authentic designer and niche fragrance. In a market where a bottle can be refilled, rebadged, decanted or straightforwardly faked, the scarce thing is not the fragrance. It is the proof that the fragrance is what the box says it is. That is the business we are actually in.</p>

  <blockquote>
    <p>For people in the Gulf who want a designer or niche fragrance and cannot afford to be wrong about it, Al Asly is the Dubai perfume house that sells only what it can account for — every bottle sourced through authorised channels, every price and every origin shown in the open.</p>
    <p style="margin-bottom:0">Unlike resellers who ask to be trusted, we show the paperwork.</p>
  </blockquote>

  <p>The name does the work. <em>Al-asly</em> — الأصلي — means <em>the original</em>, <em>the authentic</em>, <em>the source</em>. Everything the brand says is a restatement of its own name.</p>

  <h3>Personality</h3>
  <div class="tablewrap">
    <table>
      <thead><tr><th>Trait</th><th>Means</th><th>Does not mean</th></tr></thead>
      <tbody>
        <tr><td><b>Accountable</b></td><td class="use">Shows provenance before being asked</td><td class="use">Defensive, over-explaining</td></tr>
        <tr><td><b>Quietly luxurious</b></td><td class="use">Space, restraint, one gold accent</td><td class="use">Gilded everything, crowns, crests</td></tr>
        <tr><td><b>Khaleeji by default</b></td><td class="use">Arabic is first-class, not a translation layer</td><td class="use">Ornament borrowed as decoration</td></tr>
        <tr><td><b>Curatorial</b></td><td class="use">An edit with reasons</td><td class="use">An endless catalogue</td></tr>
        <tr><td><b>Plainspoken</b></td><td class="use">Short sentences, real numbers</td><td class="use">Blunt, cold, transactional</td></tr>
      </tbody>
    </table>
  </div>

  <h3>What we will not do</h3>
  <ul>
    <li>We will not sell a bottle we cannot trace.</li>
    <li>We will not describe a fragrance in words the wearer would not recognise on their own skin.</li>
    <li>We will not mock the people who buy dupes. We will simply be legible about what we sell.</li>
    <li>We will not hide a price, a fee or a sourcing route behind “contact us”.</li>
  </ul>
</section>

<!-- =========================================================== voice == -->
<section id="voice">
  <p class="eyebrow">Voice</p>
  <h2>Say the true thing first.</h2>
  <p class="lede">The headline carries the fact, not the mood. <em>Sourced from authorised distributors in Dubai</em> before <em>An olfactory journey</em>.</p>

  <div class="grid grid--2">
    <div class="card"><h4>1 · Say the true thing first</h4><p>The fact goes in the headline. The mood can have the photograph.</p></div>
    <div class="card"><h4>2 · Short sentences, generous space</h4><p>If a sentence needs a comma to survive, give it a full stop instead.</p></div>
    <div class="card"><h4>3 · Describe the scent, not the fantasy</h4><p>Name the materials, the moment it suits, how long it lasts. Skip the desert caravan.</p></div>
    <div class="card"><h4>4 · Arabic is an original</h4><p>Arabic copy is written in Arabic, by someone who writes Arabic. Carry the intent, never the idiom.</p></div>
    <div class="card"><h4>5 · Never punch down</h4><p>Counterfeits are a fact we solve, not a rival we insult.</p></div>
  </div>

  <h3>Tone by context</h3>
  <div class="tablewrap">
    <table>
      <thead><tr><th>Context</th><th>Tone</th><th>Sounds like</th></tr></thead>
      <tbody>
        <tr><td>Home / hero</td><td class="use">Assured, still</td><td class="use"><em>Perfume you can account for.</em></td></tr>
        <tr><td>Product page</td><td class="use">Precise, sensory</td><td class="use"><em>Amber, tonka, a dry cedar finish. Eight hours on skin, more on cloth.</em></td></tr>
        <tr><td>Authenticity</td><td class="use">Procedural, unhurried</td><td class="use"><em>Every bottle arrives with a batch code. Here is how to read yours.</em></td></tr>
        <tr><td>WhatsApp</td><td class="use">Warm, quick, first person</td><td class="use"><em>Yes — 100 ml is in stock. Shall I hold one for you?</em></td></tr>
        <tr><td>Checkout</td><td class="use">Flat and factual. Never persuade at the moment of payment.</td><td class="use"><em>Cash on delivery across the UAE. You pay the courier.</em></td></tr>
        <tr><td>Journal</td><td class="use">Curious, teacherly</td><td class="use"><em>Why the same bottle smells different in July.</em></td></tr>
        <tr><td>Bad news</td><td class="use">Direct, then useful</td><td class="use"><em>Sold out. The 50 ml is the same juice — or we can message you when it lands.</em></td></tr>
      </tbody>
    </table>
  </div>

  <div class="grid grid--2">
    <div class="card">
      <h4>Use</h4>
      <p>authentic · sourced · authorised · batch · decant · sillage · notes · original · house · edit · in stock · <em>hold one for you</em></p>
    </div>
    <div class="card">
      <h4>Avoid</h4>
      <p>luxury (show it, don’t claim it) · exclusive · premium · unrivalled · <em>elevate your</em> · <em>indulge in</em> · unleash · journey · exclamation marks · countdown urgency</p>
    </div>
  </div>

  <h3>Arabic</h3>
  <p>Register is Modern Standard Arabic, warm rather than formal. A light Khaleeji register is fine in WhatsApp replies, never in body copy. Never machine-translate a headline. Numerals are Western Arabic (1, 2, 3) throughout, for price clarity. The brand name in Arabic is always <b>الأصلي</b> — never a transliteration of “Al Asly”.</p>
</section>

<!-- ============================================================ logo == -->
<section id="logo">
  <p class="eyebrow">The logo</p>
  <h2>A flacon reduced to two parts.</h2>

  <div class="grid grid--2" style="align-items:center;gap:40px">
    <div style="color:var(--gold);display:grid;place-items:center;padding:20px">${mark_big}</div>
    <div>
      <p>A faceted cap, and a body split by a single hairline.</p>
      <p>The hairline is the whole idea. It reads as the glint on cut glass, and it reads as an <b>alif</b> — ا — the first letter of الأصلي and the first letter of the Arabic alphabet. The original letter, in the original bottle. Seen from a distance, cap and body together also make a Latin <b>i</b>: the first sound of <em>Asly</em>.</p>
      <p>That is a real double reading, and it is the only thing about the mark that needs explaining. Do not add anything to it.</p>
    </div>
  </div>

  <h3>The lockups</h3>
  <div class="grid grid--3">${lockup_cards}</div>

  <p class="note" style="margin-top:22px">Each ships in three inks — <b>gold</b> (default, dark grounds), <b>onyx</b> (light grounds), <b>ivory</b> (photography under a scrim) — plus a gilded variant of the primary lockup for hero and packaging.</p>
</section>

<!-- ==================================================== construction == -->
<section id="construction">
  <p class="eyebrow">Construction</p>
  <h2>Everything derives from one unit.</h2>
  <p class="lede">The width of the body: 56.</p>

  <div class="diagram-frame">${construction}</div>

  <div class="tablewrap">
    <table>
      <thead><tr><th>Element</th><th>Measure</th></tr></thead>
      <tbody>
        <tr><td>Body</td><td class="use">56 × 177.7 — a 1 : 3.173 rectangle</td></tr>
        <tr><td>Body corner radius</td><td class="use">6 &nbsp;<span class="dim">(0.107 × body width)</span></td></tr>
        <tr><td>Cap</td><td class="use">A square rotated 45°, half-diagonal 28, corner radius 8</td></tr>
        <tr><td>Cap height</td><td class="use">49.37 &nbsp;<span class="dim">(0.882 × body width)</span></td></tr>
        <tr><td>Gap, cap to body</td><td class="use">10.93 &nbsp;<span class="dim">(0.221 × cap height)</span></td></tr>
        <tr><td>Seam</td><td class="use">2.3 wide (4.1% of the body), sitting 2.4 right of centre</td></tr>
        <tr><td>Mark overall</td><td class="use">56 × 238 — a 1 : 4.25 rectangle</td></tr>
        <tr><td>Logotype cap height</td><td class="use">55 &nbsp;<span class="dim">(0.982 × body width)</span></td></tr>
        <tr><td>Logotype tracking</td><td class="use">0.33 em</td></tr>
      </tbody>
    </table>
  </div>

  <p class="note">The geometry lives in <code>tools/brand_geometry.py</code>, and every file in <code>public/brand/</code> is generated from it. No asset in that folder should ever be edited by hand — change the geometry and re-run the build.</p>

  <h3>The logotype</h3>
  <p><b>Manrope SemiBold, tracked 0.33 em, all caps.</b> It is supplied as outlines in every logo file and never re-set as live text in layout. The one exception is a plain-text context where an image cannot go — an email signature, a system-generated header.</p>
</section>

<!-- ===================================================== clear space == -->
<section id="clearspace">
  <p class="eyebrow">Clear space &amp; minimums</p>
  <h2>Give it a cap.</h2>
  <p class="lede">Clear space equals the height of the cap. Measure the diamond; keep that much empty on all four sides. Nothing enters it — no type, no rule, no image edge, no other logo.</p>

  <div class="diagram-frame" style="max-width:520px">${clearspace}</div>

  <h3>Minimum sizes</h3>
  <p>Governed by the logotype's stroke, which must stay at or above 2&nbsp;px.</p>
  <div class="tablewrap">
    <table>
      <thead><tr><th>Asset</th><th>Digital</th><th>Print</th></tr></thead>
      <tbody>
        <tr><td>Vertical lockup</td><td class="num"><b>96 px</b> wide</td><td class="num">25 mm</td></tr>
        <tr><td>Horizontal lockup</td><td class="num"><b>120 px</b> wide</td><td class="num">32 mm</td></tr>
        <tr><td>Bilingual lockup</td><td class="num"><b>120 px</b> wide</td><td class="num">32 mm</td></tr>
        <tr><td>Mark</td><td class="num"><b>24 px</b> tall</td><td class="num">8 mm</td></tr>
        <tr><td>Mark, solid</td><td class="num"><b>12 px</b> tall</td><td class="num">3 mm</td></tr>
        <tr><td>Seal</td><td class="num"><b>64 px</b></td><td class="num">18 mm</td></tr>
      </tbody>
    </table>
  </div>
  <p class="note">Below 24&nbsp;px the seam stops resolving and turns to mud. Use the solid mark there — that is what it is for, and it is also the version for embroidery, foil, deboss and laser etch.</p>
</section>

<!-- ========================================================== misuse == -->
<section id="misuse">
  <p class="eyebrow">Misuse</p>
  <h2>Eight ways to break it.</h2>
  <div class="grid grid--4">${misuse_tiles}</div>
  <p class="note" style="margin-top:22px">Also: never separate the cap from the body, never use the mark as a letter inside a word, never place it on a busy photograph without a scrim at 55% onyx or darker, and never lock it up with another brand's logo closer than the clear space allows.</p>
</section>

<!-- ========================================================== colour == -->
<section id="colour">
  <p class="eyebrow">Colour</p>
  <h2>Gold is a light, not an ink.</h2>
  <p class="lede">The brand gold is the brightest thing on a dark ground at ${gold_on_dark}, and effectively invisible on a light one at ${gold_on_light}. That single fact governs the whole palette.</p>

  <div class="swatch-strip">
    <div style="background:#171717;color:#f2cb58">onyx-850</div>
    <div style="background:#f2cb58;color:#0b0b0b">gold-500</div>
    <div style="background:#fbf8f1;color:#111111">sand-50</div>
    <div style="background:#752632;color:#f7f3ea">oud-500</div>
  </div>

  <h3>The rules that matter</h3>
  <ul>
    <li><b>Gold type on a light ground uses <code>gold-800</code></b> (${gold800_on_light}), never <code>gold-500</code>.</li>
    <li><b>Type on a gold fill is <code>onyx-950</code></b> (${onyx_on_gold}), never white.</li>
    <li><b>One gold per view.</b> Gold marks the single most important thing on a screen or a surface. A second gold element halves the value of the first.</li>
    <li>Roughly 60% ground, 30% type and structure, 8% gold, 2% oud.</li>
  </ul>

  <h3>Onyx</h3>
  <p class="note">The ground the brand stands on. Warm-neutral, never blue-black. <code>onyx-850</code> is the exact black of the logo artwork.</p>
  ${onyx_ramp}

  <h3>Gold</h3>
  <p class="note"><code>gold-500</code> is the exact gold of the logo artwork.</p>
  ${gold_ramp}

  <h3>Champagne</h3>
  <p class="note">The quiet middle: paper, packaging, dividers.</p>
  ${sand_ramp}

  <h3>Oud</h3>
  <p class="note">One accent, used sparingly for state and emphasis. At most one per view.</p>
  ${oud_ramp}

  <h3>Contrast floor</h3>
  <p>Every pair shipped in the product clears <b>WCAG AA</b>. The last row is in the table because it was tested and rejected.</p>
  <div class="tablewrap">
    <table>
      <thead><tr><th>Pair</th><th>Ratio</th><th></th><th>Where</th></tr></thead>
      <tbody>${contrast}</tbody>
    </table>
  </div>
  <p class="note"><code>onyx-400</code> on the page ground is 4.1:1 — below AA. It is a decorative grey, not a type colour. Do not use it for anything a customer has to read.</p>
</section>

<!-- ============================================================ type == -->
<section id="type">
  <p class="eyebrow">Typography</p>
  <h2>Four families, all open-licensed.</h2>
  <p class="lede">Manrope is the logotype's own face, so the interface and the logo share a skeleton. Playfair supplies the high-contrast serif voice a fragrance house needs; Amiri is its naskh counterpart — a genuine Arabic original, not a Latin face with Arabic bolted on.</p>

  <div class="families">
    <div class="family f-display"><div class="family__glyphs">Aa</div><div class="family__name">Playfair Display</div><div class="family__role">Latin display</div></div>
    <div class="family f-body"><div class="family__glyphs">Aa</div><div class="family__name">Manrope</div><div class="family__role">Logotype · text &amp; UI</div></div>
    <div class="family f-display-ar"><div class="family__glyphs">أ ص</div><div class="family__name">Amiri</div><div class="family__role">Arabic display</div></div>
    <div class="family f-body-ar"><div class="family__glyphs">أ ص</div><div class="family__name">Tajawal</div><div class="family__role">Arabic text &amp; UI</div></div>
  </div>

  <h3>Scale</h3>
  <p class="note">A 1.200 scale from 16&nbsp;px, with three display steps above it. Each step ships with the line height it was drawn for.</p>
  <div>${scale}</div>

  <h3>Tracking</h3>
  <div class="tablewrap">
    <table>
      <thead><tr><th>Token</th><th>Value</th><th>Where</th></tr></thead>
      <tbody>
        <tr><td><code>logotype</code></td><td class="num">0.33 em</td><td class="use">The brand line only</td></tr>
        <tr><td><code>eyebrow</code></td><td class="num">0.26 em</td><td class="use">All-caps eyebrows at 12 px</td></tr>
        <tr><td><code>caps</code></td><td class="num">0.14 em</td><td class="use">All-caps buttons and labels at 14 px</td></tr>
        <tr><td><code>display</code></td><td class="num">−0.015 em</td><td class="use">Display sizes, 32 px and up</td></tr>
        <tr><td><code>normal</code></td><td class="num">0</td><td class="use">Everything else, and <b>all Arabic</b></td></tr>
      </tbody>
    </table>
  </div>

  <h3>Arabic setting</h3>
  <p><b>Arabic is never letterspaced.</b> Tracking breaks the joins between letters and makes the word illegible. Arabic display needs <em>more</em> leading than Latin, not less — 1.35 minimum. Never faux-bold or italicise Arabic; Amiri and Tajawal ship the weights they ship.</p>
  <div class="panel">
    <div class="panel__head"><h4>Arabic display</h4><span>Amiri · 1.35 leading · zero tracking</span></div>
    <div class="panel__body" style="direction:rtl">
      <p style="font-family:var(--display-ar);font-size:clamp(26px,4vw,40px);line-height:1.35;margin:0;color:var(--onyx-50)">كيف نحافظ على الأصالة</p>
    </div>
  </div>
  <div class="panel">
    <div class="panel__head"><h4>Arabic body</h4><span>Tajawal · 17 px · 1.85 leading</span></div>
    <div class="panel__body" style="direction:rtl">
      <p style="font-family:var(--body-ar);font-size:17px;line-height:1.85;margin:0;color:var(--ink-muted);max-width:52ch">كل عبوة تصل ومعها رمز التشغيلة، ويمكنك التحقق منه بنفسك. نشتري من دائرة صغيرة من الموزعين المعتمدين في دبي، ولا نعرض أي عطر لا نستطيع تتبّع مصدره.</p>
    </div>
  </div>
</section>

<!-- =========================================================== space == -->
<section id="space">
  <p class="eyebrow">Space, line and elevation</p>
  <h2>A tight corner and a warm shadow.</h2>

  <div class="grid grid--2">
    <div class="card">
      <h4>Space</h4>
      <p>A 4&nbsp;px base. Section rhythm is 64 / 96 / 128. Keep a 16&nbsp;px side gutter at every width.</p>
    </div>
    <div class="card">
      <h4>Radius</h4>
      <p>Taken from the mark, whose body corner is 0.107 of its width — so the brand's corner is tight. 2 / 4 / 8 / 14&nbsp;px, and nothing rounder except a deliberate pill.</p>
    </div>
    <div class="card">
      <h4>Line</h4>
      <p>1&nbsp;px hairlines at 12% ink. The brand's divider is a hairline with a single gold cap-shaped node at its centre.</p>
    </div>
    <div class="card">
      <h4>Elevation</h4>
      <p>On champagne, a warm shadow. On onyx, <b>light, not shadow</b> — a gold rim at 22%. A dark card never casts a drop shadow.</p>
    </div>
  </div>

  <h3>The divider</h3>
  <hr class="rule">
</section>

<!-- ========================================================== motion == -->
<section id="motion">
  <p class="eyebrow">Motion</p>
  <h2>Nothing bounces. Things arrive and settle.</h2>

  <div class="tablewrap" style="max-width:560px">
    <table style="min-width:0">
      <thead><tr><th>Token</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td><code>fast</code></td><td class="num">160 ms</td></tr>
        <tr><td><code>base</code></td><td class="num">240 ms</td></tr>
        <tr><td><code>slow</code></td><td class="num">420 ms</td></tr>
        <tr><td>easing</td><td class="num">cubic-bezier(0.22, 1, 0.36, 1)</td></tr>
      </tbody>
    </table>
  </div>

  <div class="motion-demo" style="margin:26px 0 22px">
    <span style="--d:160ms">fast — hover me</span>
    <span style="--d:240ms">base — hover me</span>
    <span style="--d:420ms">slow — hover me</span>
  </div>

  <ul>
    <li>Entrances fade with a 12&nbsp;px rise. Never a scale-up.</li>
    <li>Hover changes colour and border only. No lift, no grow.</li>
    <li>The mark may reveal by drawing the seam last — once, on a first load, never on navigation.</li>
    <li>All of it collapses to 0&nbsp;ms under <code>prefers-reduced-motion</code>.</li>
  </ul>
</section>

<!-- ====================================================== components == -->
<section id="components">
  <p class="eyebrow">Components</p>
  <h2>What the system is made of.</h2>

  <div class="panel">
    <div class="panel__head"><h4>Button</h4><span>Gold carries the decision — one per view</span></div>
    <div class="panel__body panel__body--light">
      <button class="btn btn--gold">Add to bag</button>
      <button class="btn btn--onyx">View the edit</button>
      <button class="btn btn--ghost">Check a batch</button>
      <button class="btn btn--gold" disabled>Sold out</button>
    </div>
  </div>

  <div class="panel">
    <div class="panel__head"><h4>Surface</h4><span>Paper, pane, and the one gold-rimmed proof</span></div>
    <div class="panel__body" style="align-items:stretch">
      <div class="surface-demo s-paper"><h5>Free delivery</h5><p>Across the UAE on orders over AED 300. Two working days to Dubai.</p></div>
      <div class="surface-demo s-pane"><h5>Cash on delivery</h5><p>Pay the courier. No card, no deposit, no fee.</p></div>
      <div class="surface-demo s-proof"><h5>Batch 4A21</h5><p>Imported March 2026 through an authorised Dubai distributor. Code printed on the base of the bottle.</p></div>
    </div>
  </div>

  <div class="panel">
    <div class="panel__head"><h4>Product card</h4><span>The house above the name; prices in tabular figures</span></div>
    <div class="panel__body panel__body--light" style="gap:28px">
      <div class="pcard">
        <div class="pcard__frame"><span class="pcard__badge">Last one</span>${pcard_mark}</div>
        <div>
          <p class="pcard__house">Maison Francis Kurkdjian</p>
          <p class="pcard__name">Oud Satin Mood</p>
          <div class="pcard__row"><span class="pcard__size">70 ml · eau de parfum</span><span class="pcard__price">AED 1,240</span></div>
        </div>
      </div>
      <div class="pcard">
        <div class="pcard__frame">${pcard_mark2}</div>
        <div>
          <p class="pcard__house">Xerjoff</p>
          <p class="pcard__name">Naxos</p>
          <div class="pcard__row"><span class="pcard__size">50 ml · eau de parfum</span><span class="pcard__price">AED 890</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel__head"><h4>Notes pyramid</h4><span>Three tiers, in the order they are worn</span></div>
    <div class="panel__body panel__body--stack">
      <div class="notes">
        <div class="notes__tier"><span class="notes__label">Top</span><ul class="notes__list"><li>Bergamot</li><li>Pink pepper</li></ul></div>
        <div class="notes__tier"><span class="notes__label">Heart</span><ul class="notes__list"><li>Rose</li><li>Saffron</li><li>Jasmine</li></ul></div>
        <div class="notes__tier"><span class="notes__label">Base</span><ul class="notes__list"><li>Oud</li><li>Tonka</li><li>Dry cedar</li></ul></div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel__head"><h4>Seal</h4><span>Proof of origin — never a generic trust badge</span></div>
    <div class="panel__body" style="gap:34px;color:var(--gold)">
      ${seal_big}
      <div style="color:var(--ink)">
        <p class="eyebrow" style="color:var(--ink-subtle);margin-bottom:6px">Batch</p>
        <p style="font-size:18px;font-weight:600;font-variant-numeric:tabular-nums;margin:0">4A21 · 03/2026</p>
        <p style="font-size:14px;color:var(--ink-muted);margin:4px 0 0">Authorised distributor, Dubai</p>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel__head"><h4>Field</h4><span>The label never leaves — a placeholder is not a label</span></div>
    <div class="panel__body panel__body--light" style="align-items:flex-start;gap:28px">
      <div class="field">
        <label for="kit-name">Full name</label>
        <input id="kit-name" type="text" placeholder="As it appears on your ID">
        <p class="help">The courier checks this on delivery.</p>
      </div>
      <div class="field field--error">
        <label for="kit-phone">Mobile</label>
        <input id="kit-phone" type="tel" value="050 000" aria-invalid="true" aria-describedby="kit-phone-help">
        <p class="help" id="kit-phone-help">Add a UAE mobile number so the courier can call.</p>
      </div>
    </div>
  </div>
</section>

<!-- ==================================================== applications == -->
<section id="applications">
  <p class="eyebrow">Applications</p>
  <h2>Where it lands.</h2>
  <div class="grid grid--2">
    <div class="card"><h4>Packaging</h4><p>Bilingual lockup on onyx board, gold foil. Seal on the flap. Batch code printed, never stickered over.</p></div>
    <div class="card"><h4>The card in the box</h4><p>Champagne stock, onyx type, one gold rule. Carries the batch code, the source, and the line. This card is the product's proof — treat it as part of the product.</p></div>
    <div class="card"><h4>Shopfront</h4><p>Bilingual lockup, Arabic no smaller than the Latin. Brushed brass or gold vinyl on a dark ground.</p></div>
    <div class="card"><h4>WhatsApp</h4><p>Avatar is the mark on onyx. First reply always names a person.</p></div>
    <div class="card"><h4>Social</h4><p>Onyx grid, one gold element per post, generous margins.</p></div>
    <div class="card"><h4>Invoices &amp; email</h4><p>Horizontal lockup, onyx ink on white. Seal beside the authenticity note, not beside the total.</p></div>
  </div>

  <div class="diagram-frame" style="text-align:center;margin-top:32px;background:var(--onyx-950)">
    <div style="color:var(--gold);display:grid;place-items:center;gap:30px">
      ${horiz}
      ${bilingual}
    </div>
  </div>
</section>

<!-- =========================================================== files == -->
<section id="files">
  <p class="eyebrow">Files</p>
  <h2>Everything is generated.</h2>
  <p class="lede">No asset in <code>public/brand/</code> is drawn by hand. Change the geometry or the palette, run the build, and every file — SVG, PNG, icon, share card — is rewritten from the same source.</p>

  <div class="tablewrap">
    <table>
      <thead><tr><th>Path</th><th>Holds</th></tr></thead>
      <tbody>
        <tr><td><code>public/brand/logo/</code></td><td class="use">Lockups, mark, wordmarks, seal, tiles — in gold, onyx and ivory</td></tr>
        <tr><td><code>public/brand/icon/</code></td><td class="use">favicon, small-size favicon, maskable icon, PNG app icons</td></tr>
        <tr><td><code>public/brand/png/</code></td><td class="use">2048 px transparent PNG exports of every lockup</td></tr>
        <tr><td><code>public/brand/social/</code></td><td class="use">og-image.png (1200×630), avatar.png (1024²)</td></tr>
        <tr><td><code>src/styles/tokens.ts</code></td><td class="use">The single source of truth for colour, type, space, radius, elevation and motion</td></tr>
        <tr><td><code>docs/BRAND.md</code></td><td class="use">This book, as markdown</td></tr>
        <tr><td><code>tools/brand_geometry.py</code></td><td class="use">The measured construction of the mark</td></tr>
        <tr><td><code>tools/build_brand_assets.py</code></td><td class="use">Writes every file in <code>public/brand/</code></td></tr>
        <tr><td><code>tools/build_brand_kit.py</code></td><td class="use">Writes this page</td></tr>
      </tbody>
    </table>
  </div>

  <h3>Rebuilding</h3>
  <p>Two commands, no dependencies beyond Python, Pillow and fontTools:</p>
  <p><code>python3 tools/build_brand_assets.py</code><br><code>python3 tools/build_brand_kit.py</code></p>

  <h3>Fonts</h3>
  <p>Playfair Display, Manrope, Amiri and Tajawal are all SIL Open Font License — free to use, embed and redistribute. No licence to buy, no foundry to clear. The logotypes are supplied as outlines, so no logo file depends on a font being installed.</p>
</section>

<footer>
  <div class="mark">${footer_mark}</div>
  <p style="margin-bottom:6px"><b>Al Asly · الأصلي</b> — Brand book v1.0</p>
  <p style="margin:0">Generated from the artwork by <code>tools/build_brand_kit.py</code>. Nothing but the original.</p>
</footer>

</main>
</div>
</body>
</html>
"""


if __name__ == "__main__":
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(build())
    print(f"{os.path.relpath(OUT, ROOT)}  {os.path.getsize(OUT) / 1024:.0f} KB")
