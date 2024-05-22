import console from 'node:console';
import path from 'node:path';
import { distTsConfig, dtsDir, isProduction } from '@/scripts/constants';
import { execProcess } from '@/scripts/utils/process';
import chalk from 'chalk';

const processDtsName = 'types';
const processTspcName = 'tspc';

export const watchTypes = () => {
  let startTime = 0;
  let endTime = 0;

  return new Promise<void>((resolve, reject) => {
    const processDtsFiles = () => {
      startTime = performance.now();

      console.log(chalk.yellow('Compiling types (*.d.ts)...'));

      execProcess(processDtsName, 'tsx', [path.resolve(dtsDir, 'index.ts')], { FORCE_COLOR: '1' }, (message) => {
        console.log(message);
      })
        .then(resolve)
        .catch(reject)
        .finally(() => {
          endTime = performance.now();
          const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

          console.log(chalk.green(`Done in ${chalk.bold(`${timeTaken}s`)}`));

          startTime = 0;
          endTime = 0;
        });
    };

    execProcess(
      processTspcName,
      'tspc',
      [
        '--project',
        distTsConfig,
        '--emitDeclarationOnly',
        '--declaration',
        '--declarationMap',
        '--watch',
        '--preserveWatchOutput',
      ],
      {},
      (data) => {
        if (isProduction) console.log(data);

        if (data.includes('Found 0 errors.')) {
          processDtsFiles();
        }
      },
    )
      .then(resolve)
      .catch(reject);
  });
};

// if the script is run directly (i.e. `tsx watch.ts`)
if (process.argv[1] && import.meta.url === new URL(process.argv[1], `file://${process.cwd()}/`).href) {
  watchTypes().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
