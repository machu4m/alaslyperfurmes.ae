# Fonts used to generate the logo files

The logotypes in `public/brand/` are supplied as **outlines**, so no shipped
logo depends on a font being installed. These two files exist only so
`tools/build_brand_assets.py` can regenerate those outlines.

| File | Family | Licence |
|---|---|---|
| `Manrope600.ttf` | Manrope SemiBold — the Latin logotype | SIL Open Font License 1.1 |
| `Amiri-Regular.ttf` | Amiri — the Arabic logotype | SIL Open Font License 1.1 |

Both are redistributable under the OFL. Sources:
<https://fonts.google.com/specimen/Manrope> and
<https://fonts.google.com/specimen/Amiri>.

The web app loads both from Google Fonts at runtime (see
`src/app/[locale]/layout.tsx`); these copies are build-time inputs only.
