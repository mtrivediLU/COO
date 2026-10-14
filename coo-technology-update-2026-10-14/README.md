# COO technology update · October 14, 2026

The single supplied nine-slide Claude Design handoff is the final source selected by the user's approval on October 13, 2026. The handoff's older “awaiting approval” metadata is retained as provenance. No competing exports or ZIP files were supplied.

- `index.html`, `presentation.css`, `presentation.js`: standalone web presentation.
- `assets/`: original COO logos and report/tracker screenshots, descriptively renamed.
- `downloads/`: published, editable PowerPoint, with all notes parts removed.
- `design-source/`: Claude Design HTML and preview shell, structured slide content, and original PPTX.
- `reference-documents/`: original handoff and nine visual references.

GitHub Pages continues to publish the root of `main`. `_config.yml` excludes design source, reference documents, build scripts, and this README. The original homepage is unchanged. All presentation URLs are relative, supporting the `/COO/` hosting base path.

Rebuild with Python 3 and `beautifulsoup4` installed:

```sh
python3 scripts/build-presentation.py
```

The generator preserves the approved markup and editable PPTX shapes. The supplied `deck-stage.js` is archived only; the production shell has no presenter notes, authoring controls, or external runtime dependencies. The Claude preview's unsupplied `support.js` is not required by the website.

## Outstanding source information

The handoff, HTML, JSON, and PPTX contain no actual Power BI report or Grants Tracker URLs. The website preserves the report CTA visually as a disabled label until the real URL is supplied; it does not publish a fake destination. Add the confirmed URLs to the structured content and both exports before treating external hyperlink verification as complete.
