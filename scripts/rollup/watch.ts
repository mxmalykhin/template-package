import console from 'node:console';
import { distCjs, distEsm, isProduction } from '@/scripts/constants';
import rollupConfig from '@/scripts/rollup/build';
import chalk from 'chalk';
import { type RollupWatcherEvent, watch } from 'rollup';

const processName = 'rollup';

export const watchRollup = async () => {
  const config = await rollupConfig();

  let startTime = 0;
  let endTime = 0;
  let timeTaken = '';

  return new Promise<void>((resolve, reject) => {
    const watcher = watch(config);

    watcher.on('event', (event) => {
      const isCjsOutput = (e: RollupWatcherEvent) => {
        return 'output' in e ? e.output.some((output) => output.includes(distCjs)) : false;
      };

      const isEsmOutput = (e: RollupWatcherEvent) => {
        return 'output' in e ? e.output.some((output) => output.includes(distEsm)) : false;
      };

      let moduleText = null;

      if (isCjsOutput(event)) {
        moduleText = chalk.bold('CJS');
      } else if (isEsmOutput(event)) {
        moduleText = chalk.bold('ESM');
      }

      switch (event.code) {
        case 'START':
          console.log(chalk.yellow('Starting bundling...'));
          startTime = performance.now();
          break;
        case 'BUNDLE_START':
          if (isProduction) console.log(chalk.yellow(`Bundling${moduleText ? ` ${moduleText}` : ''}...`));
          break;
        case 'BUNDLE_END':
          console.log(chalk.yellow(`Bundle${moduleText ? ` ${moduleText}` : ''} done in ${event.duration}ms`));
          break;
        case 'END':
          endTime = performance.now();
          timeTaken = ((endTime - startTime) / 1000).toFixed(2);

          console.log(chalk.green(`Done in ${chalk.bold(`${timeTaken}s`)}`));
          startTime = 0;
          endTime = 0;
          resolve();
          break;
        case 'ERROR':
          console.error(chalk.red(`Error: ${event.error}`), event);
          reject(event.error);
          break;
        default:
          break;
      }
    });
  });
};

// if the script is run directly (i.e. `tsx watch.ts`)
if (process.argv[1] && import.meta.url === new URL(process.argv[1], `file://${process.cwd()}/`).href) {
  watchRollup().catch((err) => {
    console.error(chalk.red(`[${processName}]`), err);
    process.exit(1);
  });
}
