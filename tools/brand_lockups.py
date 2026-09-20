"""The Al Asly lockups, composed from the mark and the logotypes."""
from __future__ import annotations

import brand_geometry as g
import brand_type as t

# --------------------------------------------------------------- the mark ---
MARK_VIEWBOX = (0, 0, g.MARK_W, g.MARK_H)


def mark() -> dict:
    return {"viewBox": MARK_VIEWBOX, "body": f'<path d="{g.mark_path()}"/>'}


# ------------------------------------------------------------ the logotype --
def _latin():
    return t.latin_wordmark(
        g.WORDMARK_FONT, g.WORDMARK_TEXT, g.GLYPH_LEFTS,
        g.CAP_HEIGHT, g.WORDMARK_BASELINE,
    )


def wordmark() -> dict:
    d, (x0, y0, x1, y1) = _latin()
    pad_top = g.WORDMARK_CAP_TOP - y0        # the S's overshoot
    return {
        "viewBox": (x0, g.WORDMARK_CAP_TOP - pad_top, x1 - x0, y1 - (g.WORDMARK_CAP_TOP - pad_top)),
        "body": f'<path d="{d}"/>',
    }


ARABIC_TEXT = "الأصلي"


def arabic_wordmark(size: float = 100.0) -> dict:
    d, (x0, y0, x1, y1) = t.shaped_text(g.ARABIC_FONT, ARABIC_TEXT, size)
    return {"viewBox": (x0, y0, x1 - x0, y1 - y0), "body": f'<path d="{d}"/>'}


# ----------------------------------------------------------- the lockups ----
def lockup_vertical() -> dict:
    """Primary. Mark over logotype, both centred on the same axis."""
    d, (x0, y0, x1, y1) = _latin()
    left = min(x0, 0.0)
    right = max(x1, g.MARK_W)
    return {
        "viewBox": (left, 0.0, right - left, y1),
        "body": f'<path d="{g.mark_path()}"/><path d="{d}"/>',
    }


def lockup_horizontal() -> dict:
    """Mark beside the logotype, optically centred on the cap band."""
    cap = g.CAP_HEIGHT
    mark_h = cap * 2.72
    scale = mark_h / g.MARK_H
    gap = cap * 1.02

    d, (x0, y0, x1, y1) = _latin()
    word_w = x1 - x0
    mark_w = g.MARK_W * scale

    # cap band of the logotype runs from 0 to `cap`; centre the mark on it
    mark_y = (cap - mark_h) / 2
    word_dx = mark_w + gap - x0
    word_dy = -g.WORDMARK_CAP_TOP

    top = min(mark_y, y0 + word_dy)
    bottom = max(mark_y + mark_h, y1 + word_dy)
    return {
        "viewBox": (0.0, top, mark_w + gap + word_w, bottom - top),
        "body": (
            f'<g transform="translate(0 {mark_y:.3f}) scale({scale:.5f})">'
            f'<path d="{g.mark_path()}"/></g>'
            f'<g transform="translate({word_dx:.3f} {word_dy:.3f})"><path d="{d}"/></g>'
        ),
    }


def lockup_bilingual() -> dict:
    """Primary lockup with the Arabic logotype set beneath a hairline rule."""
    base = lockup_vertical()
    vb = base["viewBox"]
    cap = g.CAP_HEIGHT

    ar_size = cap * 1.88
    ad, (ax0, ay0, ax1, ay1) = t.shaped_text(g.ARABIC_FONT, ARABIC_TEXT, ar_size)
    ar_w, ar_h = ax1 - ax0, ay1 - ay0

    rule_y = vb[1] + vb[3] + cap * 0.62
    rule_w = vb[2] * 0.26
    rule_x = vb[0] + (vb[2] - rule_w) / 2

    ar_top = rule_y + cap * 0.56
    dx = vb[0] + (vb[2] - ar_w) / 2 - ax0
    dy = ar_top - ay0

    return {
        "viewBox": (vb[0], vb[1], vb[2], (ar_top + ar_h) - vb[1]),
        "body": (
            base["body"]
            + f'<rect x="{rule_x:.3f}" y="{rule_y:.3f}" width="{rule_w:.3f}" height="1.2" opacity="0.45"/>'
            + f'<g transform="translate({dx:.3f} {dy:.3f})"><path d="{ad}"/></g>'
        ),
    }


# --------------------------------------------------------------- the seal ---
SEAL_R = 100.0
SEAL_TOP = "AL ASLY · DUBAI"
SEAL_BOTTOM = "AUTHENTICITY VERIFIED"


def mark_solid() -> dict:
    """The mark without its hairline, for anything under 24px tall and for any
    process that cannot hold a line 4% of the body's width: embroidery, foil,
    deboss, laser etch, a favicon at 16px."""
    body = (
        g.rounded_diamond(g.CAP_CX, g.CAP_CY, g.CAP_D, g.CAP_R)
        + " "
        + g.rounded_rect(0, g.BOTTLE_TOP, g.BOTTLE_W, g.BOTTLE_BOTTOM - g.BOTTLE_TOP, g.BOTTLE_R)
    )
    return {"viewBox": MARK_VIEWBOX, "body": f'<path d="{body}"/>'}


def _ring(r: float, w: float) -> str:
    inner = r - w
    return (
        f"M0,{-r:.3f} A{r:.3f},{r:.3f} 0 1 1 0,{r:.3f} A{r:.3f},{r:.3f} 0 1 1 0,{-r:.3f}Z "
        f"M0,{-inner:.3f} A{inner:.3f},{inner:.3f} 0 1 0 0,{inner:.3f} "
        f"A{inner:.3f},{inner:.3f} 0 1 0 0,{-inner:.3f}Z"
    )


def seal() -> dict:
    """The authenticity seal: the mark inside a ring of set type.

    The brand's promise is provenance, so it gets a device that looks like a
    stamp rather than a badge. The name and the city run above, the claim beneath;
    two cap-shaped nodes mark the seams at three and nine o'clock.
    """
    r = SEAL_R
    ring = r * 0.845
    size = r * 0.105

    top = t.text_on_circle(g.WORDMARK_FONT, SEAL_TOP, size=size, radius=ring,
                           centre_deg=-90, tracking_em=0.22)
    bottom = t.text_on_circle(g.WORDMARK_FONT, SEAL_BOTTOM, size=size * 0.92,
                              radius=ring, centre_deg=90, tracking_em=0.22, flip=True)

    node = g.CAP_R * 0.30
    nodes = "".join(
        g.rounded_diamond(cx, 0.0, r * 0.052, node)
        for cx in (-ring, ring)
    )

    mark_h = r * 0.80
    scale = mark_h / g.MARK_H
    return {
        "viewBox": (-r, -r, 2 * r, 2 * r),
        "body": (
            f'<path d="{_ring(r, r * 0.022)}"/>'
            f'<path d="{_ring(r * 0.935, r * 0.008)}"/>'
            f'<path d="{top}"/><path d="{bottom}"/>'
            f'<path d="{nodes}"/>'
            f'<g transform="translate({-g.MARK_W * scale / 2:.3f} {-mark_h / 2:.3f}) '
            f'scale({scale:.5f})"><path d="{g.mark_path()}"/></g>'
        ),
    }
