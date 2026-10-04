# Portfolio Thesis V296 — Audit Package

Purpose: make the large single-file V296 prototype easier for a source reader to audit.

## Files
- `V296_ORIGINAL_UNMODIFIED.html` — byte-for-byte copy of the uploaded V296 source. This is the authoritative runnable prototype.
- `index.html` — audit-friendly HTML/markup view with inline CSS and inline JavaScript replaced by labeled placeholders.
- `styles.css` — all 85 original `<style>` block bodies, concatenated in original source order.
- `app.js` — all 84 original inline `<script>` block bodies, concatenated in original source order.

## Important
`index.html`, `styles.css`, and `app.js` are **audit views**, not a refactored production build.
Moving inline scripts can change execution timing, so no claim is made that the three split files are behaviorally identical when run separately.
Use `V296_ORIGINAL_UNMODIFIED.html` whenever exact runtime behavior or source ordering matters.

No application logic, calculations, text, CSS declarations, or JavaScript statements were intentionally rewritten.
The original file itself is included unchanged.

Original SHA-256:
`8b6f245c973f50b7ce97099a0d6893424ac36b8c54c95c11862818f677604adf`

Note: the uploaded filename says V296, while the document `<title>` currently says `Portfolio Thesis V228`. This package leaves that unchanged for the audit.
