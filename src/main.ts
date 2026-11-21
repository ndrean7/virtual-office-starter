// Virtual Office Starter — minimal Univer setup.
// One page, two editors: a spreadsheet panel and a document panel.
//
// Each panel is its own Univer instance. That is the standard pattern from
// the Univer docs: one preset (and therefore one UI container) per
// createUniver call. A single Univer instance has exactly one UI container,
// so two presets in one instance would fight over it — only the last one
// would render.
//
// Only official @univerjs npm packages are used; all code in this file is original.
import { LocaleType, getDocsEmptySnapshot, mergeLocales } from '@univerjs/core';
import { UniverDocsCorePreset } from '@univerjs/preset-docs-core';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import { createUniver } from '@univerjs/presets';
import { defaultTheme } from '@univerjs/themes';
import UniverPresetDocsCoreEnUS from '@univerjs/preset-docs-core/locales/en-US';
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US';
import '@univerjs/preset-docs-core/lib/index.css';
import '@univerjs/preset-sheets-core/lib/index.css';
import './style.css';

// --- Spreadsheet panel -----------------------------------------------------
// Formula calculation runs in a worker so the UI thread stays responsive.
const formulaWorker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

const { univerAPI: sheetAPI } = createUniver({
  locale: LocaleType.EN_US,
  locales: {
    [LocaleType.EN_US]: mergeLocales(UniverPresetSheetsCoreEnUS),
  },
  theme: defaultTheme,
  presets: [
    UniverSheetsCorePreset({
      container: 'univer-sheet',
      workerURL: formulaWorker,
    }),
  ],
});

// Demo spreadsheet: a small budget table. The Total row uses a live formula
// (=SUM) so the formula worker is exercised on load.
sheetAPI.createWorkbook({
  id: 'starter-workbook',
  name: 'Budget',
  appVersion: '1.5.2',
  locale: LocaleType.EN_US,
  styles: {},
  sheetOrder: ['sheet-1'],
  sheets: {
    'sheet-1': {
      id: 'sheet-1',
      name: 'Budget',
      rowCount: 100,
      columnCount: 20,
      cellData: {
        0: { 0: { v: 'Item' }, 1: { v: 'Amount (USD)' } },
        1: { 0: { v: 'Coffee' }, 1: { v: 4.5 } },
        2: { 0: { v: 'Lunch' }, 1: { v: 12 } },
        3: { 0: { v: 'Transport' }, 1: { v: 8 } },
        4: { 0: { v: 'Total' }, 1: { f: '=SUM(B2:B4)' } },
      },
      rowData: {},
      columnData: {},
    },
  },
});

// --- Document panel --------------------------------------------------------
const { univerAPI: docAPI } = createUniver({
  locale: LocaleType.EN_US,
  locales: {
    [LocaleType.EN_US]: mergeLocales(UniverPresetDocsCoreEnUS),
  },
  theme: defaultTheme,
  presets: [
    UniverDocsCorePreset({
      container: 'univer-doc',
    }),
  ],
});

// Demo document: a short welcome note. Paragraphs are separated by \r and
// the stream ends with \n (the section break). The snapshot is built on top
// of the SDK's own empty-document snapshot, which supplies the page size,
// margins and section break — without a section break the layout engine
// produces no pages and the document stays blank.
const docLines = [
  'Virtual Office — Meeting Notes',
  'Welcome to your virtual office.',
  'This document is powered by the Univer Docs engine.',
  'Type here to start writing.',
];

const docBase = getDocsEmptySnapshot();
const docDataStream = `${docLines.join('\r')}\r\n`;

let docOffset = 0;
const docParagraphs = docLines.map((line, index) => {
  const startIndex = docOffset;
  docOffset += line.length + 1; // +1 for the \r separator
  return { startIndex, paragraphId: `para-${index}`, paragraphStyle: {} };
});

docAPI.createDocument({
  ...docBase,
  id: 'starter-doc',
  title: 'Meeting Notes',
  body: {
    ...docBase.body,
    dataStream: docDataStream,
    textRuns: [{ st: 0, ed: docLines[0].length, ts: { fs: 20, bl: 1 } }],
    paragraphs: docParagraphs,
    sectionBreaks: [
      { sectionId: 'section-1', startIndex: docDataStream.length - 1 },
    ],
  },
});

// Exposed for the browser console so you can poke at the live editors, e.g.
//   __virtualOffice.sheetAPI.getActiveWorkbook().getActiveSheet().getRange('B5').getValue()
//   __virtualOffice.docAPI.getActiveDocument()
(window as unknown as { __virtualOffice: unknown }).__virtualOffice = {
  sheetAPI,
  docAPI,
};
