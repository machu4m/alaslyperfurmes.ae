"""Outline extraction for the Al Asly logotypes.

The logotype is Manrope SemiBold, tracked out, converted to outlines so the
files carry no font dependency. The Arabic logotype is Amiri, shaped with
HarfBuzz first so the ligatures and the lam-alef are correct.
"""
from __future__ import annotations

import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform
import math
from fontTools.ttLib import TTFont

FONT_DIR = os.path.join(os.path.dirname(__file__), "fonts")


def _font(name: str) -> TTFont:
    return TTFont(os.path.join(FONT_DIR, name))


def _draw(font: TTFont, glyph_name: str, transform: Transform) -> str:
    pen = SVGPathPen(font.getGlyphSet(), ntos=lambda v: f"{v:.3f}".rstrip("0").rstrip("."))
    font.getGlyphSet()[glyph_name].draw(TransformPen(pen, transform))
    return pen.getCommands()


def latin_wordmark(font_name: str, text: str, lefts: dict[int, float],
                   cap_height: float, baseline: float) -> tuple[str, tuple]:
    """Set `text` with each glyph pinned to a measured ink-left position.

    Positioning by measured ink edges rather than by advance widths reproduces
    the original artwork's spacing exactly, kerning included.
    """
    font = _font(font_name)
    upm = font["head"].unitsPerEm
    cap = font["OS/2"].sCapHeight
    scale = cap_height / cap
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()

    paths, minx, miny, maxx, maxy = [], 1e9, 1e9, -1e9, -1e9
    for i, ch in enumerate(text):
        gname = cmap[ord(ch)]
        bp = BoundsPen(gs)
        gs[gname].draw(bp)
        x0, y0, x1, y1 = bp.bounds
        # pin the glyph's inked left edge to the measured position
        tx = lefts[i] - x0 * scale
        t = Transform(scale, 0, 0, -scale, tx, baseline)
        paths.append(_draw(font, gname, t))
        minx = min(minx, lefts[i]); maxx = max(maxx, tx + x1 * scale)
        miny = min(miny, baseline - y1 * scale); maxy = max(maxy, baseline - y0 * scale)
    return " ".join(paths), (minx, miny, maxx, maxy)


def shaped_text(font_name: str, text: str, size: float,
                origin: tuple[float, float] = (0.0, 0.0),
                direction: str = "rtl", script: str = "arab",
                language: str = "ar") -> tuple[str, tuple]:
    """Shape `text` with HarfBuzz and return it as outlines."""
    import uharfbuzz as hb

    path = os.path.join(FONT_DIR, font_name)
    with open(path, "rb") as fh:
        data = fh.read()
    face = hb.Face(data)
    hbfont = hb.Font(face)
    upm = face.upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.direction = direction
    buf.script = script
    buf.language = language
    hb.shape(hbfont, buf)

    font = _font(font_name)
    gs = font.getGlyphSet()
    order = font.getGlyphOrder()
    scale = size / upm

    paths, minx, miny, maxx, maxy = [], 1e9, 1e9, -1e9, -1e9
    x = y = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        gname = order[info.codepoint]
        gx = x + pos.x_offset * scale
        gy = y + pos.y_offset * scale
        t = Transform(scale, 0, 0, -scale, origin[0] + gx, origin[1] - gy)
        bp = BoundsPen(gs)
        gs[gname].draw(bp)
        if bp.bounds:
            x0, y0, x1, y1 = bp.bounds
            minx = min(minx, origin[0] + gx + x0 * scale)
            maxx = max(maxx, origin[0] + gx + x1 * scale)
            miny = min(miny, origin[1] - gy - y1 * scale)
            maxy = max(maxy, origin[1] - gy - y0 * scale)
            paths.append(_draw(font, gname, t))
        x += pos.x_advance * scale
        y += pos.y_advance * scale
    return " ".join(paths), (minx, miny, maxx, maxy)


def text_on_circle(font_name: str, text: str, size: float, radius: float,
                   centre_deg: float = -90.0, tracking_em: float = 0.0,
                   flip: bool = False) -> str:
    """Set `text` around a circle centred on the origin, centred on
    `centre_deg` (-90 is the top of the circle, +90 the bottom).

    Glyphs are placed by advance width converted to arc length and rotated to
    stand upright on the circle. `flip` runs the string anticlockwise with the
    glyphs turned over, which is how the lower half of a seal is set so it
    still reads left to right. Used for the authenticity seal.
    """
    font = _font(font_name)
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    scale = size / upm
    track = tracking_em * size

    advances = []
    for ch in text:
        gname = cmap.get(ord(ch))
        adv = (hmtx[gname][0] * scale if gname else size * 0.32) + track
        advances.append((gname, adv))

    sweep = sum(a for _, a in advances) / radius
    direction = -1.0 if flip else 1.0
    angle = math.radians(centre_deg) - direction * sweep / 2

    paths = []
    for gname, adv in advances:
        step = adv / radius
        mid = angle + direction * step / 2
        if gname:
            rot = mid + (math.pi / 2 if not flip else -math.pi / 2)
            t = (Transform()
                 .translate(math.cos(mid) * radius, math.sin(mid) * radius)
                 .rotate(rot)
                 .scale(scale, -scale)
                 .translate(-(adv - track) / 2 / scale, 0))
            paths.append(_draw(font, gname, t))
        angle += direction * step
    return " ".join(paths)
