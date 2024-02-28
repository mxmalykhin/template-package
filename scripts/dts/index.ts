import path from 'node:path';

import { dist } from '@repo/constants';
import { copyFile } from '@repo/scripts/utils/fileOperations';

import apiExtractor from './apiExtractor';
import processDtsFiles from './processDtsFiles';

async function main() {
  try {
    console.debug('Starting .d.ts build process...');
    await apiExtractor();

    console.debug('Copying index.d.ts as index.d.cts...');
    await copyFile(
      path.join(dist, 'index.d.ts'),
      path.join(dist, 'index.d.cts')
    );

    console.debug('Processing DTS files...');
    await processDtsFiles();

    console.debug('.d.ts build process completed successfully.');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error(`Error during .d.ts build process: ${error as any}`);
    process.exit(1);
  }
}

void main();
