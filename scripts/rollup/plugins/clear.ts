import * as path from 'node:path';
import { root } from '@@/scripts/constants';
import { glob } from 'glob';
import { rimraf } from 'rimraf';
import type { Plugin } from 'rollup';

interface ClearOptions {
  targets: string[];
  watch?: boolean;
}

export default function clear(options: ClearOptions): Plugin {
  const { targets = [], watch = false } = options;
  const workspace = root;

  const clearTargets = async (targets: string[]): Promise<void> => {
    for (const targetPattern of targets) {
      const files = await glob(targetPattern, { cwd: workspace });

      for (const file of files) {
        const fullPath = path.resolve(workspace, file);

        await rimraf(fullPath);

        console.debug('Cleared:', fullPath);
      }
    }
  };

  return {
    name: 'clear-plugin',
    buildStart: async () => {
      await clearTargets(targets);
    },
    watchChange: async () => {
      if (watch) {
        await clearTargets(targets);
      }
    },
  };
}
