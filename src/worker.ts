// Worker entry for the Univer formula engine.
// The sheets preset runs formula calculation in this worker so the UI thread
// stays responsive. Uses only the official @univerjs preset packages.
import { createUniver } from '@univerjs/presets';
import { UniverSheetsCoreWorkerPreset } from '@univerjs/preset-sheets-core/worker';

createUniver({
  presets: [UniverSheetsCoreWorkerPreset()],
});
