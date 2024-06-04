import chalk from 'chalk';
import { execa } from 'execa';

import { extractorBin, isProduction } from '@@/scripts/constants';

export default async function apiExtractor() {
  // biome-ignore lint/complexity/useLiteralKeys: FIXME
  if (process.env['NODE_ENV'] === 'production') console.debug('Running api-extractor...');

  try {
    const { stdout, stderr } = await execa(extractorBin, ['run', !isProduction ? '--local' : ''], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { NODE_NO_WARNINGS: '1' },
    });

    if (stderr) {
      console.error(stderr);
    }

    const lines = stdout.split('\n');

    for (const line of lines) {
      if (line.includes('API Extractor completed successfully')) {
        if (isProduction) console.log(chalk.green('API Extractor: completed'));
      }
    }
  } catch (error) {
    console.error('Error running api-extractor:', error);
  }
}
