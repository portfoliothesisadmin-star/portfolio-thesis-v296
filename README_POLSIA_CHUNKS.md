# Portfolio Thesis V296 — Polsia-sized JavaScript audit chunks

Source: `app.js`

This package splits the extracted V296 JavaScript into 43 sequential files of about 15 KB each so Polsia can retrieve smaller source pages without the truncation seen with the earlier ~55 KB chunks.

Important:
- No intentional code rewriting, reformatting, or reordering was performed.
- Splits occur only at original line boundaries.
- Read files strictly in numeric order: `polsia-01.js` through `polsia-43.js`.
- These are audit chunks, not independent runnable modules.
- Concatenating all chunks in order reconstructs `app.js` exactly.
- The authoritative runtime reference remains `V296_ORIGINAL_UNMODIFIED.html`.
- Use `MANIFEST_POLSIA.json` for original line ranges, byte sizes, and SHA-256 hashes.
- Original app.js SHA-256: `ae1e04c13e309def4ed7fa7b2b0ff24ccf53e4dc7548ed94a4efeeec0d5d3674`.
