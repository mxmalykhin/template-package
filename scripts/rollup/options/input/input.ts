import * as process from 'node:process';
import { entry, src } from '@@/scripts/constants';
import chalk from 'chalk';
import { glob } from 'glob';
import type { InputOption } from 'rollup';

const inputRoot = entry;

export const getInput = (isMulti: boolean): InputOption => {
  if (isMulti) {
    const files = glob.sync('**/*', {
      cwd: src,
      absolute: true,
      nodir: true,
    });

    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    if (process.env['NODE_ENV'] === 'production') {
      console.debug(chalk.yellow('Find inputs:'), files);
    }

    return files;
  }

  return inputRoot;
};
