import type { InputOption } from 'rollup';

import { entry } from '@repo/scripts/constants';

const inputRoot = entry;

export const getInput = (isMulti: boolean): InputOption => {
  if (isMulti) {
    return [inputRoot];
  }

  return inputRoot;
};
