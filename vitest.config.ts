/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config';

import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

import { root, tempTestsReports } from '@@/scripts/constants';

export default defineConfig({
  plugins: [tsconfigPaths()],
  root,
  test: {
    ...configDefaults,
    exclude: [...configDefaults.exclude, '**/scripts/**'],
    environment: 'node',
    mockReset: true,
    testTimeout: 1000,
    hookTimeout: 1000,
    teardownTimeout: 1000,
    setupFiles: [path.resolve(root, 'vitest.setup.ts')],
    open: false,
    reporters: ['verbose'],
    globals: true,
    logHeapUsage: true,
    passWithNoTests: true,
    fakeTimers: {
      ...configDefaults.fakeTimers,
      toFake: [
        ...configDefaults.fakeTimers.toFake,
        //        'performance',
        //        'hrtime',
        //        'nextTick',
        //        'queueMicrotask',
        //        'requestAnimationFrame',
        //        'cancelAnimationFrame',
        //        'requestIdleCallback',
        //        'cancelIdleCallback',
      ],
    },
    coverage: {
      ...configDefaults.coverage,
      enabled: false,
      exclude: [...(configDefaults.coverage?.exclude ?? []), '**/scripts/**'],
      reportsDirectory: path.resolve(tempTestsReports, 'coverage'),
    },
  },
});
