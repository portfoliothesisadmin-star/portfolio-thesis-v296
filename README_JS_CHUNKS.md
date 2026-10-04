# Portfolio Thesis V296 — JavaScript Audit Chunks

This package exists only to work around source-reader truncation.

- Original `app.js` size: 635,451 bytes
- Chunks: 12
- Target chunk size: about 55 KB
- Original `app.js` SHA-256: `ae1e04c13e309def4ed7fa7b2b0ff24ccf53e4dc7548ed94a4efeeec0d5d3674`

## Audit rule
Read `app-01.js` through `app-12.js` in numeric order.

Each file is a consecutive slice of the extracted `app.js`, split only at line boundaries.
No JavaScript statements were intentionally rewritten, reformatted, summarized, or reordered.

`MANIFEST.json` records the original `app.js` line range, byte size, and SHA-256 for every chunk.

These are **audit chunks**, not independent runnable modules. Runtime behavior must be judged against the original unmodified V296 HTML/source ordering.
