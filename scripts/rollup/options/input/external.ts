import { builtinModules as nodeBuiltinModules } from 'node:module';
import type { ExternalOption } from 'rollup';

import { pkgJson } from '@repo/scripts/constants';

const allDeps = [
  ...nodeBuiltinModules,
  // @ts-ignore
  ...Object.keys(pkgJson.dependencies || {}),
  // @ts-ignore
  ...Object.keys(pkgJson.peerDependencies || {}),
  // @ts-ignore
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
