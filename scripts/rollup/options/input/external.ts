import { builtinModules as nodeBuiltinModules } from 'node:module';

import { pkgJson } from '@repo/scripts/constants';
import type { ExternalOption } from 'rollup';

const allDeps = [
  ...nodeBuiltinModules,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ...Object.keys(pkgJson.dependencies || {}),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ...Object.keys(pkgJson.peerDependencies || {}),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ...Object.keys(pkgJson.devPeerDependencies || {}),
];

export const getExternals: ExternalOption = (path) => {
  if (path.includes('node_modules')) {
    return true;
  }

  if (/^[a-z].*\//.test(path)) {
    path = path.replace(/^([^/]+)\/.*$/, '$1');
  } else if (/^@[a-z].*\//.test(path)) {
    path = path.replace(/^(@[a-z-]+\/[^/]+)\/.*$/, '$1');
  }

  return allDeps.includes(path);
};
