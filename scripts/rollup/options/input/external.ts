import { builtinModules as nodeBuiltinModules } from 'node:module';

import { pkgJson } from '@/scripts/constants';
import type { ExternalOption } from 'rollup';

const allDeps = [
  ...nodeBuiltinModules,
  // @ts-expect-error
  ...Object.keys(pkgJson.dependencies || {}),
  // @ts-expect-error
  ...Object.keys(pkgJson.peerDependencies || {}),
  // @ts-expect-error
  ...Object.keys(pkgJson.devPeerDependencies || {}),
];

export const getExternals: ExternalOption = (path) => {
  let externalPath = path;

  if (path.includes('node_modules')) {
    return true;
  }

  if (/^[a-z].*\//.test(path)) {
    externalPath = path.replace(/^([^/]+)\/.*$/, '$1');
  } else if (/^@[a-z].*\//.test(path)) {
    externalPath = path.replace(/^(@[a-z-]+\/[^/]+)\/.*$/, '$1');
  }

  return allDeps.includes(externalPath);
};
