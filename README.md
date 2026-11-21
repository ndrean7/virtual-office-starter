# Virtual Office Starter

A minimal working web app with an embedded spreadsheet and document editor on
one page — a tiny "virtual office" built on the **Univer Office SDK**
([dream-num/univer](https://github.com/dream-num/univer), Apache-2.0).

> Starter/demo ini dibuat di atas SDK Univer. Bukan salinan repositori Univer —
> semua kode di repo ini orisinal, dan engine kantornya diinstal dari npm
> (`@univerjs/*`).

## What is inside

- **Spreadsheet** — full Univer Sheets UI (toolbar, formula bar, grid) with a
  demo budget table. The `Total` row uses a live `=SUM(...)` formula, which
  runs in a Web Worker so the UI thread stays responsive.
- **Document** — Univer Docs editor with a short welcome note. Just click and
  type.
- **Stack** — Vite + TypeScript. No backend, no database, everything runs in
  the browser.

## Run it

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev     # open http://localhost:5173
```

Build a production bundle:

```bash
npm run build   # typecheck (tsc) + vite build -> dist/
npm run preview # serve the production build locally
```

## How it works

- `src/main.ts` — creates **two independent Univer instances** (one per
  panel), following the standard Univer pattern of one preset — and therefore
  one UI container — per `createUniver` call:
  - spreadsheet instance: `UniverSheetsCorePreset` in `#univer-sheet`, with
    the formula worker, plus one demo workbook;
  - document instance: `UniverDocsCorePreset` in `#univer-doc`, plus one
    demo document. The demo document is built on the SDK's own
    `getDocsEmptySnapshot()` (page size, margins, section break) — a
    document without a section break lays out zero pages and renders blank.
  The live APIs are exposed as `window.__virtualOffice` (`sheetAPI`,
  `docAPI`) so you can inspect them from the browser console.
- `src/worker.ts` — worker entry for the formula engine
  (`UniverSheetsCoreWorkerPreset`).
- `index.html` — page layout: header, spreadsheet panel, document panel.
- `src/style.css` — layout styles only; the office UI styling comes from the
  Univer preset CSS bundles.

## License

MIT for the code in this repository (see `LICENSE`). The Univer Office SDK
itself is Apache-2.0, copyright DreamNum Co., Ltd. — see the
`@univerjs/*` packages in `node_modules` after install.
