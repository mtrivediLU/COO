> Implementation update: the user supplied the Power BI URL after initial deployment. The confirmed destination is recorded in `../design-source/slides.json` and applied to the website and PowerPoint. The missing-URL statements below describe the original handoff; only the Grants Tracker URL remains outstanding.

# Developer handoff — COO Economic Development technology update

Status: **design awaiting approval.** Once approved, this design is frozen. Implement it as shown; do not redesign.

Visual source of truth, in priority order:
1. `../design-source/coo-technology-update.dc.html`: the approved slide markup, with exact inline values. Its relative asset paths were updated for the renamed folders. The original Claude preview runtime (`support.js`) was not supplied; the standalone production entry point is `../index.html`.
2. `../reference-documents/slide-01.png` … `slide-09.png`: reference images (1920×1080, upscaled from preview captures, so use them for layout only, not pixel sampling).
3. `../design-source/slides.json`: structured content. Web and PPTX should both render from this file.

## Files
- `../design-source/slides.json`: all slide content, layout keys, links, reference image paths
- `../downloads/coo-technology-update-2026-10-14.pptx`: editable PPTX export of the approved design (native text and shapes, no speaker notes)
- `../assets/coo-logo-primary.png`: primary logo, red, transparent PNG, 576×240 (ratio 2.4:1)
- `../assets/coo-logo-reversed-white.png`: reversed white logo, transparent PNG, 576×240
- `../design-source/`: the design source and the deck shell used for preview

## Brand rules applied (COO Brand Guidelines 2023)
- Typeface: Arial only (Regular and Bold). Fallback stack `Arial, Helvetica, sans-serif`. Body text is always left-aligned.
- Colours: `#BB0A12` red (Pantone 2035C), `#E0DFD9` light neutral (Pantone 9080C), `#000000`, `#FFFFFF`. No other colours, tints or gradients.
- Logo: use the supplied PNGs only. Never recolour, outline, add shadows, rotate, stretch or apply transparency to them. Keep the aspect ratio locked by setting height only and `width:auto`. Clear space on every side must be at least the height of the "E" in the wordmark (about 21% of the logo height). Digital minimum width is 44px. Use the reversed white logo on red and the primary logo on white.
- Photography: none used. No approved photos were supplied.

## Layout specification (desktop, 1920×1080 base)
- Content slides (02–08): padding `80px 110px 56px`, white background, flex column.
- Header row: eyebrow (24px Bold, uppercase, letter-spacing 0.08em, `#BB0A12`), then 14px gap, then title (64px Bold, line-height 1.08, black). Optional subtitle: 30–32px Regular. Primary logo top-right at 80px tall (192px wide).
- Footer: 2px `#E0DFD9` top rule, 20px padding-top, 24px Regular. Left: "Economic Development · Technology progress and next steps". Right: two-digit slide number.
- Slide 01: red full-bleed. Grid `1.15fr / 0.85fr`, 120px gap, padding `90px 110px 80px`. Reversed logo 120px tall. Title 88px Bold, line-height 1.05.
- Slide 09: white top area with the same header, three columns (`1.3fr 1fr 1fr`, 72px gap, vertically centred), and a full-bleed red closing band (padding `56px 110px`, 56px Bold white).

Type scale (px): 150 numbers · 120/96 metrics · 88 cover title · 64 title · 56 closing · 44 statement · 40/48 column heads · 32–26 body · 24 minimum (labels, footers, tags). Nothing below 24px at 1920 wide.

Spacing: section gaps of 48–80px, item gaps of 14–28px, card padding of 28–48px.

## Status language (keep it consistent; it carries meaning)
- **Complete / current:** filled `#BB0A12` circle (18px), with items on `#E0DFD9` surfaces or solid rules
- **Pending / next / future / to be confirmed:** outlined circle (14px, 2px black) and **3px dashed black** borders
- **Qualification tag:** black fill, white 24px Bold uppercase text (for example "Preliminary — manual verification required")
- Red is reserved for emphasis: the total (1,225), step numbers, the return loop, eyebrows and the primary column.

## Content rules (do not change)
- Slide 3 (as of October 13, 2026): 735 + 490 = 1,225 submitted responses collected; 66 incomplete excluded. 1,182 are in the current Power BI dataset. 43 are awaiting processing and are **already part of** the 1,225; never add them again. Response counts are never labelled as unique businesses; the unique-business count requires duplicate review.
- Slide 4 (report preview): the 912 figure is a filtered screenshot count (Ontario filter). Keep it visually separate from the slide 3 dataset figures. Automation is planned, not in place.
- Removed figures: 11 pending submissions, 8 requiring geocoding and ≈1,157 businesses are outdated and must not appear anywhere.
- Slide 6: the tracker is not publicly launched. Keep the dashed status tag visible.
- Slides 7–8: the output destination is "To be confirmed". Keep the open point visible on the slide.
- Do not add deadlines, budgets, savings, URLs or commitments.

## Web presentation behaviour
- **Desktop (≥1200px wide, landscape):** a fixed 1920×1080 stage, letterboxed and scaled to fit the viewport (`scale = min(vw/1920, vh/1080)`). Black (#000) letterbox.
- **Tablet (768–1199px):** keep the scaled stage when landscape. In portrait, switch to reflow mode (below).
- **Mobile (<768px) and tablet portrait, reflow mode:** slides stack vertically as full-width panels with padding of 24px (mobile) or 48px (tablet). Same markup order, with these sizes: title 32/44px, statement 24/30px, body 18/20px, labels 14/16px, big numbers 64/96px. Collapse grids to one column, except:
  - Slide 3: the equation stacks vertically (735, +, 490, =, 1,225).
  - Slide 5: process steps become a vertical numbered list. The Future box goes last.
  - Slide 7: the five steps become a vertical list with zone labels above each group. Render the return loop as a dashed red side bracket from step 4 back to step 2, with its label. "To be confirmed" stays directly under step 5.
  - Slide 8: the next-steps table becomes stacked group/text pairs.
  - Keep the logo at least 44px wide, with clear space.
- **Controls (all sizes):** a fixed bottom bar outside the slide containing Previous, "n / 9" progress text and a thin progress bar (`#BB0A12` on `#E0DFD9`), Next, Fullscreen and **Download PowerPoint**. Download PowerPoint is a solid `#BB0A12` button with white Arial Bold text, at least 44px tall, linking to `../downloads/coo-technology-update-2026-10-14.pptx` with the `download` attribute. On mobile the bar is sticky and the download button stays visible.
- **Keyboard:** ←/→, PageUp/PageDown and Space move between slides. Home/End jump to the first/last slide. F toggles fullscreen. Esc exits fullscreen. Sync the hash (`#3`) to the current slide so a slide can be deep-linked.
- **Touch:** horizontal swipe in stage mode. Plain vertical scroll in reflow mode.
- **Transitions:** 250ms opacity crossfade between slides. With `prefers-reduced-motion: reduce`, there is no transition (instant cut). No build animations.
- **Speaker notes:** none. Do not add notes, a presenter view or notes controls in the web build or PPTX.
- **Accessibility:** one `<h1>` on slide 1 and `<h2>` per slide title. Logo `alt="Chiefs of Ontario"`. Controls have aria-labels. Focus rings are 3px `#000` on white or 3px `#FFFFFF` on red. Mark diagrams (slides 5 and 7) up as ordered lists.

## PPTX
- 16:9 (13.333 × 7.5 in). Editable text and shapes. Arial throughout. Logos embedded as images at locked aspect ratio. No speaker notes.
- Hyperlinks: the "View COO Power BI report" button must be a real hyperlink in the PPTX. Its URL has not been supplied yet, so the current export carries a placeholder. Regenerate the PPTX once the URL is added.
- The supplied PPTX was generated from this design. Regenerate it from `../design-source/slides.json` during implementation and compare it against the reference images.

## Asset inventory
- Primary logo (red): supplied, extracted from the brand guidelines PDF (p.6). Used on slides 02–09.
- Reversed logo (white): supplied, extracted from the PDF (p.9). Used on slide 01.
- Higher-resolution vector logos: **missing**. The guidelines say vector/PNG art is available from the COO Communications sector. Request the files and swap them in at the same size.
- COO Power BI report screenshot: `../assets/coo-power-bi-report.png` (3440×1915, bottom white margin trimmed only). Slide 04, 690px tall, aspect locked.
- Grants tracker screenshot: `../assets/grants-tracker.png` (1010×527, cropped to search, filters, result count and first grant card). Slide 06, full left-column width, aspect locked.
- Photography: none, and none is required.

## Hyperlink inventory
- "View COO Power BI report" (slide 04 report preview, red button): **URL missing**. The placeholder href is `#power-bi-report-url-needed`. Replace it with the real report URL in the web build and as a real PPTX hyperlink on the button shape, then test both.
- Download PowerPoint (web only): `./../downloads/coo-technology-update-2026-10-14.pptx`
- Missing, pending COO confirmation: the grants tracker review page URL. Do not invent it.

## Implementation checklist
1. Implement the approved design.
2. Generate the matching downloadable PPTX.
3. Test slide navigation, responsive behaviour, hyperlinks, downloads and PowerPoint output.
4. Commit and push implementation changes to the designated repository.
5. Deploy to the designated hosting environment and test the live URL.
6. Report the final URL, files changed and any remaining manual verification.

## Screenshots
- Display screenshots as supplied: no redrawing, recolouring, overlays or decorative frames. Only a 2px #E0DFD9 hairline border.
- On mobile reflow, screenshots go full width with the caption directly below. Tap opens the image full size.
