# Al Asly — brand assets

Everything in this folder is **generated**. Do not edit these files by hand —
change `tools/brand_geometry.py` (construction) or the palette in
`tools/build_brand_assets.py`, then run:

```bash
python3 tools/build_brand_assets.py
```

Full rules: [`docs/BRAND.md`](../../docs/BRAND.md).

## Which file do I want?

| I need… | Use |
|---|---|
| The logo, default | `logo/alasly-lockup-vertical.svg` |
| The logo in a header or a wide banner | `logo/alasly-lockup-horizontal.svg` |
| The logo on packaging or a shopfront | `logo/alasly-lockup-bilingual.svg` |
| The logo on a light background | any `-onyx` variant |
| The logo on a dark photo or onyx | the default (gold) variant |
| A hero or packaging logo that should read as leaf | `logo/alasly-lockup-vertical-gilded.svg` |
| An avatar, sticker or app tile | `logo/alasly-tile.svg`, `social/avatar.png` |
| Anything under 24 px, or embroidery / foil / deboss | `logo/alasly-mark-solid.svg` |
| The authenticity stamp | `logo/alasly-seal.svg` |
| A share card | `social/og-image.png` |
| A PNG for a deck or a supplier | `png/…@2048.png` |

## Inks

Every logo ships in three: **gold** (no suffix — the default, dark grounds
only), **`-onyx`** (light grounds), **`-ivory`** (dark or photographic
grounds where gold would compete).

Gold is a light, not an ink. `#f2cb58` on `#fbf8f1` is 1.4 : 1 — it fails
every contrast standard. On light grounds use `-onyx`, and for gold *type* on
light use `#86651c`.

## Clear space

The height of the cap, on all four sides. The `logo/alasly-tile*.svg` files
have it built in.

## Minimum sizes

| Asset | Digital | Print |
|---|---|---|
| Vertical lockup | 96 px wide | 25 mm |
| Horizontal lockup | 120 px wide | 32 mm |
| Mark | 24 px tall | 8 mm |
| Mark, solid | 12 px tall | 3 mm |
| Seal | 64 px | 18 mm |

## Fonts

Manrope (logotype + UI), Playfair Display (Latin display), Amiri (Arabic
display), Tajawal (Arabic UI). All SIL OFL — free to use and redistribute.
The logotype is supplied as outlines, so no logo file depends on a font
being installed.
