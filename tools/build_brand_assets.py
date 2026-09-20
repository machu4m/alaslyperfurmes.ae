#!/usr/bin/env python3
"""Regenerate every file in public/brand/ from the measured logo geometry.

    python3 tools/build_brand_assets.py

Nothing under public/brand/ should be edited by hand — change the geometry in
tools/brand_geometry.py (or the palette here) and re-run.
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import cairosvg  # noqa: E402

import brand_geometry as g  # noqa: E402
import brand_lockups as L  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "public", "brand")

GOLD = "#F2CB58"
GOLD_LIGHT = "#F7DC85"
GOLD_DEEP = "#D8A93C"
ONYX = "#171717"
IVORY = "#F7F3EA"

INKS = {"gold": GOLD, "onyx": ONYX, "ivory": IVORY}

GRADIENT = (
    '<linearGradient id="asly-gold" x1="0" y1="0" x2="0.35" y2="1">'
    f'<stop offset="0" stop-color="{GOLD_LIGHT}"/>'
    f'<stop offset="0.52" stop-color="{GOLD}"/>'
    f'<stop offset="1" stop-color="{GOLD_DEEP}"/>'
    "</linearGradient>"
)


def _vb(v) -> str:
    return " ".join(f"{x:.3f}".rstrip("0").rstrip(".") for x in v)


def svg(piece: dict, *, fill: str, title: str, desc: str,
        pad: float = 0.0, bg: str | None = None, gradient: bool = False,
        square: bool = False) -> str:
    x, y, w, h = piece["viewBox"]
    if square:
        side = max(w, h) + 2 * pad
        x -= (side - w) / 2
        y -= (side - h) / 2
        w = h = side
    else:
        x -= pad; y -= pad; w += 2 * pad; h += 2 * pad

    defs = f"<defs>{GRADIENT}</defs>" if gradient else ""
    paint = "url(#asly-gold)" if gradient else fill
    back = f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{_vb((x, y, w, h))}" '
        f'width="{w:.2f}" height="{h:.2f}" role="img" aria-labelledby="t d">'
        f"<title id=\"t\">{title}</title><desc id=\"d\">{desc}</desc>"
        f"{defs}{back}<g fill=\"{paint}\">{piece['body']}</g></svg>"
    )


def write(path: str, content: str) -> None:
    full = os.path.join(BRAND, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as fh:
        fh.write(content + "\n")
    print("  ", os.path.relpath(full, ROOT))


def write_png(path: str, source_svg: str, width: int, height: int | None = None) -> None:
    full = os.path.join(BRAND, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    cairosvg.svg2png(bytestring=source_svg.encode(), write_to=full,
                     output_width=width, output_height=height)
    print("  ", os.path.relpath(full, ROOT))


PIECES = {
    "mark": (L.mark, "Al Asly mark", "The Al Asly flacon mark: a faceted cap over a body split by a single hairline."),
    "wordmark": (L.wordmark, "Al Asly wordmark", "The Al Asly logotype: AL ASLY."),
    "wordmark-ar": (lambda: L.arabic_wordmark(100.0), "Al Asly wordmark, Arabic", "The Al Asly Arabic logotype: الأصلي."),
    "lockup-vertical": (L.lockup_vertical, "Al Asly", "The primary Al Asly lockup: the flacon mark above the AL ASLY logotype."),
    "lockup-horizontal": (L.lockup_horizontal, "Al Asly", "The horizontal Al Asly lockup: the flacon mark beside the AL ASLY logotype."),
    "lockup-bilingual": (L.lockup_bilingual, "Al Asly | الأصلي", "The bilingual Al Asly lockup: the flacon mark above the AL ASLY and الأصلي logotypes."),
    "mark-solid": (L.mark_solid, "Al Asly mark, solid", "The Al Asly flacon mark without its hairline, for use below 24px and in single-pass processes."),
    "seal": (L.seal, "Al Asly authenticity seal", "The Al Asly authenticity seal: the flacon mark inside a ring reading AL ASLY · DUBAI and AUTHENTICITY VERIFIED."),
}


def build() -> None:
    print("logo/")
    for name, (fn, title, desc) in PIECES.items():
        piece = fn()
        for ink, colour in INKS.items():
            suffix = "" if ink == "gold" else f"-{ink}"
            write(f"logo/alasly-{name}{suffix}.svg", svg(piece, fill=colour, title=title, desc=desc))

    # gilded variant of the primary lockup, for hero and packaging use
    write("logo/alasly-lockup-vertical-gilded.svg",
          svg(L.lockup_vertical(), fill=GOLD, gradient=True,
              title="Al Asly", desc="The primary Al Asly lockup in gilded gold."))

    # the signature tile — gold on onyx, clear space built in
    clear = g.CAP_D * 2 - g.CAP_R * 2 * (2 ** 0.5 - 1)   # one cap height
    write("logo/alasly-tile.svg",
          svg(L.lockup_vertical(), fill=GOLD, bg=ONYX, pad=clear * 1.42, square=True,
              title="Al Asly", desc="The Al Asly lockup in gold on onyx."))
    write("logo/alasly-tile-inverse.svg",
          svg(L.lockup_vertical(), fill=ONYX, bg=GOLD, pad=clear * 1.42, square=True,
              title="Al Asly", desc="The Al Asly lockup in onyx on gold."))
    write("logo/alasly-tile-ivory.svg",
          svg(L.lockup_vertical(), fill=ONYX, bg=IVORY, pad=clear * 1.42, square=True,
              title="Al Asly", desc="The Al Asly lockup in onyx on ivory."))

    print("icon/")
    icon = svg(L.mark(), fill=GOLD, bg=ONYX, pad=g.MARK_W * 0.62, square=True,
               title="Al Asly", desc="The Al Asly flacon mark in gold on onyx.")
    # below ~32px the hairline turns to mud, so the small icons use the solid mark
    icon_small = svg(L.mark_solid(), fill=GOLD, bg=ONYX, pad=g.MARK_W * 0.62, square=True,
                     title="Al Asly", desc="The Al Asly flacon mark, solid, in gold on onyx.")
    write("icon/favicon-16.svg", icon_small)
    write("icon/favicon.svg", icon)
    write("icon/favicon-ivory.svg",
          svg(L.mark(), fill=ONYX, bg=IVORY, pad=g.MARK_W * 0.62, square=True,
              title="Al Asly", desc="The Al Asly flacon mark in onyx on ivory."))
    # maskable icons need the mark inside the safe circle: 40% more padding
    maskable = svg(L.mark(), fill=GOLD, bg=ONYX, pad=g.MARK_W * 1.34, square=True,
                   title="Al Asly", desc="The Al Asly flacon mark, maskable.")
    write("icon/icon-maskable.svg", maskable)
    for size in (180, 192, 512):
        write_png(f"icon/icon-{size}.png", icon, size, size)
    write_png("icon/icon-maskable-512.png", maskable, 512, 512)

    print("png/")
    for name in ("lockup-vertical", "lockup-horizontal", "lockup-bilingual", "mark", "wordmark", "seal"):
        piece = PIECES[name][0]()
        for ink in ("gold", "onyx", "ivory"):
            suffix = "" if ink == "gold" else f"-{ink}"
            s = svg(piece, fill=INKS[ink], title=PIECES[name][1], desc=PIECES[name][2], pad=6)
            vbw, vbh = piece["viewBox"][2] + 12, piece["viewBox"][3] + 12
            w = 2048 if vbw >= vbh else int(2048 * vbw / vbh)
            write_png(f"png/alasly-{name}{suffix}@2048.png", s, w, None)

    print("social/")
    vert = L.lockup_vertical()
    vx, vy, vw, vh = vert["viewBox"]
    og_h = vh * 2.35
    og_w = og_h * 1200 / 630
    og = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx + vw/2 - og_w/2:.2f} '
        f'{vy + vh/2 - og_h/2:.2f} {og_w:.2f} {og_h:.2f}" width="1200" height="630">'
        f'<defs>{GRADIENT}'
        f'<radialGradient id="glow" cx="0.5" cy="0.42" r="0.62">'
        f'<stop offset="0" stop-color="#2A2724"/><stop offset="1" stop-color="{ONYX}"/>'
        f"</radialGradient></defs>"
        f'<rect x="{vx + vw/2 - og_w/2:.2f}" y="{vy + vh/2 - og_h/2:.2f}" '
        f'width="{og_w:.2f}" height="{og_h:.2f}" fill="url(#glow)"/>'
        f'<g fill="url(#asly-gold)">{vert["body"]}</g></svg>'
    )
    write_png("social/og-image.png", og, 1200, 630)
    write_png("social/avatar.png",
              svg(vert, fill=GOLD, bg=ONYX, pad=(g.CAP_D * 2) * 1.42, square=True,
                  title="Al Asly", desc="Al Asly avatar."), 1024, 1024)


def build_react_paths() -> None:
    """Emit the geometry as a TS module so the app can inline the logo as
    currentColor SVG instead of fetching a file."""
    out = os.path.join(ROOT, "src", "components", "brand", "logo-paths.ts")
    os.makedirs(os.path.dirname(out), exist_ok=True)

    entries = []
    for key, fn in (
        ("mark", L.mark), ("markSolid", L.mark_solid), ("wordmark", L.wordmark),
        ("wordmarkAr", lambda: L.arabic_wordmark(100.0)),
        ("vertical", L.lockup_vertical), ("horizontal", L.lockup_horizontal),
        ("bilingual", L.lockup_bilingual), ("seal", L.seal),
    ):
        piece = fn()
        vb = " ".join(f"{v:.3f}".rstrip("0").rstrip(".") for v in piece["viewBox"])
        ratio = piece["viewBox"][3] / piece["viewBox"][2]
        entries.append(
            f'  {key}: {{\n    viewBox: "{vb}",\n    ratio: {ratio:.5f},\n'
            f'    body: \'{piece["body"]}\',\n  }},'
        )

    body = "\n".join(entries)
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(
            "/**\n"
            " * Al Asly logo geometry, as inlinable SVG.\n"
            " *\n"
            " * GENERATED by tools/build_brand_assets.py — do not edit.\n"
            " * Change tools/brand_geometry.py and re-run the build.\n"
            " */\n\n"
            "export type LogoShape = {\n  viewBox: string;\n  /** height / width */\n  ratio: number;\n  body: string;\n};\n\n"
            "export const logoShapes = {\n" + body + "\n} as const;\n\n"
            "export type LogoShapeName = keyof typeof logoShapes;\n"
        )
    print("  ", os.path.relpath(out, ROOT))


if __name__ == "__main__":
    os.makedirs(BRAND, exist_ok=True)
    build()
    print("src/components/brand/")
    build_react_paths()
    print("\ndone")
