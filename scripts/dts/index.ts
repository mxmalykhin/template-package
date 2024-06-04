import * as console from 'node:console';
import path from 'node:path';
import * as process from 'node:process';
import chalk from 'chalk';

import { dist, isProduction } from '@@/scripts/constants';
import apiExtractor from '@@/scripts/dts/apiExtractor';
import processDtsFiles from '@@/scripts/dts/processDtsFiles';
import { copyFile } from '@@/scripts/utils/fileOperations';

async function main() {
  try {
    if (isProduction) console.debug('Starting .d.ts compilation...');

    await apiExtractor();

    await copyFile(path.join(dist, 'index.d.ts'), path.join(dist, 'index.d.cts'));

    if (isProduction) console.debug('Processing DTS files...');
    await processDtsFiles();

    console.debug(chalk.yellow('*.d.ts files compiled'));
  } catch (error) {
    console.error(
      chalk.red(
        `Error during .d.ts build process: ${
          // biome-ignore lint/suspicious/noExplicitAny: FIXME ???
          error as any
        }`,
      ),
    );
    process.exit(1);
  }
}

void main();
