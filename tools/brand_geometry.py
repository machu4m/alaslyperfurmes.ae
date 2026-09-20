"""Al Asly logo geometry.

Every number here was measured off the original artwork (see docs/BRAND.md,
"Construction") and then snapped to a construction grid where the bottle body
is 56 units wide. Re-running tools/build_brand_assets.py regenerates every
file in public/brand/ from this one source of truth.
"""
from __future__ import annotations

import math

# ---------------------------------------------------------------- palette ---
GOLD = "#E8C15C"
GOLD_LIGHT = "#F4DC7E"
GOLD_DEEP = "#C79A3C"
ONYX = "#141414"
IVORY = "#F7F3EA"

# ------------------------------------------------------------ construction --
BOTTLE_W = 56.0          # body width — the master unit of the whole system
BOTTLE_TOP = 60.3
BOTTLE_BOTTOM = 238.0
BOTTLE_R = 6.0           # body corner radius

CAP_D = 28.0             # half-diagonal of the cap's underlying square
CAP_R = 8.0              # cap corner radius
CAP_CX = BOTTLE_W / 2
CAP_CY = CAP_D - CAP_R * (math.sqrt(2) - 1)   # puts the cap's apex on y = 0

SEAM_X = 30.4            # the hairline that splits the body
SEAM_W = 2.3
SEAM_STRAIGHT_TO = 188.0
SEAM_C1 = (30.40, 188.42)
SEAM_C2 = (30.04, 213.30)
SEAM_END = (13.40, 229.23)

MARK_W = BOTTLE_W
MARK_H = BOTTLE_BOTTOM

# Wordmark, expressed in the same units.
CAP_HEIGHT = 55.0        # cap height of "AL ASLY"
TRACKING_EM = 0.335      # letterspacing of the logotype
WORDMARK_FONT = "Manrope600.ttf"
ARABIC_FONT = "Amiri-Regular.ttf"

# Ink-left of each glyph, measured off the original, relative to the body's
# left edge, then nudged so the wordmark centres exactly on the mark.
GLYPH_LEFTS = {
    0: -186.42,   # A
    1: -106.04,   # L
    2: -9.22,     # A
    3: 65.58,     # S
    4: 144.21,    # L
    5: 195.56,    # Y
}
WORDMARK_TEXT = "ALASLY"
WORDMARK_RIGHT = 242.42
WORDMARK_BASELINE = 374.58        # y of the baseline in lockup space
WORDMARK_CAP_TOP = WORDMARK_BASELINE - CAP_HEIGHT


def _fmt(v: float) -> str:
    s = f"{v:.3f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def pt(x: float, y: float) -> str:
    return f"{_fmt(x)},{_fmt(y)}"


def rounded_rect(x: float, y: float, w: float, h: float, r: float) -> str:
    """Rounded rectangle as an explicit path (arcs, not <rect>, so the whole
    mark can live in one compound path)."""
    return (
        f"M{pt(x + r, y)}"
        f"H{_fmt(x + w - r)}A{_fmt(r)},{_fmt(r)} 0 0 1 {pt(x + w, y + r)}"
        f"V{_fmt(y + h - r)}A{_fmt(r)},{_fmt(r)} 0 0 1 {pt(x + w - r, y + h)}"
        f"H{_fmt(x + r)}A{_fmt(r)},{_fmt(r)} 0 0 1 {pt(x, y + h - r)}"
        f"V{_fmt(y + r)}A{_fmt(r)},{_fmt(r)} 0 0 1 {pt(x + r, y)}Z"
    )


def rounded_diamond(cx: float, cy: float, d: float, r: float) -> str:
    """A square rotated 45 degrees with rounded corners. `d` is the
    half-diagonal of the underlying sharp square."""
    k = r * math.sqrt(2)          # apex -> arc centre, along the bisector
    t = r / math.sqrt(2)          # arc centre -> tangent point, per axis
    apexes = [(cx, cy - d), (cx + d, cy), (cx, cy + d), (cx - d, cy)]
    centres = [(cx, cy - d + k), (cx + d - k, cy), (cx, cy + d - k), (cx - d + k, cy)]
    tangents = []
    for (ax, ay), (mx, my) in zip(apexes, centres):
        if ax == cx and ay < cy:        # top
            tangents.append(((mx - t, my - t), (mx + t, my - t)))
        elif ay == cy and ax > cx:      # right
            tangents.append(((mx + t, my - t), (mx + t, my + t)))
        elif ax == cx:                  # bottom
            tangents.append(((mx + t, my + t), (mx - t, my + t)))
        else:                           # left
            tangents.append(((mx - t, my + t), (mx - t, my - t)))
    d_ = f"M{pt(*tangents[0][1])}"
    for i in range(1, 5):
        j = i % 4
        d_ += f"L{pt(*tangents[j][0])}A{_fmt(r)},{_fmt(r)} 0 0 1 {pt(*tangents[j][1])}"
    return d_ + "Z"


# --- the seam, as a closed sliver so the mark stays one self-contained path --
def _seam_centreline_samples(n: int = 96):
    p0 = (SEAM_X, SEAM_STRAIGHT_TO)
    p1, p2, p3 = SEAM_C1, SEAM_C2, SEAM_END
    pts = []
    for i in range(n + 1):
        t = i / n
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t**3 * p3[1]
        dx = 3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
        dy = 3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
        m = math.hypot(dx, dy) or 1.0
        pts.append((x, y, dx / m, dy / m))
    return pts


def _fit_offset_cubic(samples, side: float):
    """Least-squares cubic through the offset of the seam's centreline.

    The centreline is gentle enough that a single cubic tracks its offset to
    well under a tenth of a unit, which keeps the exported path compact."""
    h = SEAM_W / 2 * side
    pts = [(x + h * ty, y - h * tx) for x, y, tx, ty in samples]
    p0, p3 = pts[0], pts[-1]
    t0 = (samples[0][2], samples[0][3])
    t3 = (samples[-1][2], samples[-1][3])
    ts = [i / (len(pts) - 1) for i in range(len(pts))]

    def curve(a, b):
        p1 = (p0[0] + t0[0] * a, p0[1] + t0[1] * a)
        p2 = (p3[0] - t3[0] * b, p3[1] - t3[1] * b)
        return p1, p2

    def sse(a, b):
        p1, p2 = curve(a, b)
        tot = 0.0
        for t, (px, py) in zip(ts, pts):
            mt = 1 - t
            x = mt**3*p0[0] + 3*mt*mt*t*p1[0] + 3*mt*t*t*p2[0] + t**3*p3[0]
            y = mt**3*p0[1] + 3*mt*mt*t*p1[1] + 3*mt*t*t*p2[1] + t**3*p3[1]
            tot += (x - px) ** 2 + (y - py) ** 2
        return tot

    a = b = math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / 3
    step = a / 2
    for _ in range(60):
        improved = False
        for da, db in ((step, 0), (-step, 0), (0, step), (0, -step)):
            if a + da > 0 and b + db > 0 and sse(a + da, b + db) < sse(a, b):
                a, b = a + da, b + db
                improved = True
        if not improved:
            step /= 2
    p1, p2 = curve(a, b)
    return p0, p1, p2, p3


def seam_path() -> str:
    """Outline of the hairline gap that splits the body: down the left flank,
    round the tip, back up the right flank.

    It is wound anticlockwise against the clockwise body, so plain nonzero
    fill turns it into a hole. That keeps the mark one self-contained path
    that needs no fill-rule, no mask and no knowledge of the background.
    """
    h = SEAM_W / 2
    samples = _seam_centreline_samples()
    r0, r1, r2, r3 = _fit_offset_cubic(samples, +1)
    l0, l1, l2, l3 = _fit_offset_cubic(samples, -1)
    return (
        f"M{pt(SEAM_X - h, BOTTLE_TOP)}"
        f"L{pt(*l0)}C{pt(*l1)} {pt(*l2)} {pt(*l3)}"
        f"A{_fmt(h)},{_fmt(h)} 0 0 0 {pt(*r3)}"
        f"C{pt(*r2)} {pt(*r1)} {pt(*r0)}"
        f"L{pt(SEAM_X + h, BOTTLE_TOP)}Z"
    )


def mark_path() -> str:
    """The complete bottle mark as one evenodd path."""
    return " ".join([
        rounded_diamond(CAP_CX, CAP_CY, CAP_D, CAP_R),
        rounded_rect(0, BOTTLE_TOP, BOTTLE_W, BOTTLE_BOTTOM - BOTTLE_TOP, BOTTLE_R),
        seam_path(),
    ])
