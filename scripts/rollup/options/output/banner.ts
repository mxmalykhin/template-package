import type { OutputOptions } from 'rollup';

import { copyright, now, pkgJson } from '@@/scripts/constants';
import { getCommitHash } from '@@/scripts/utils/getCommitHash';

// biome-ignore lint/complexity/noBannedTypes: it's a just function
export const getBanner: Extract<OutputOptions['banner'], Function> = (chunk) => {
  const buildDate = now.toISOString().slice(0, 10);

  const banner = `/**
 * @module ${pkgJson.name}
 * @version ${pkgJson.version}
 * @commit ${getCommitHash()}
 * @description ${pkgJson.description}
 * @file ${chunk.fileName}
 * @date ${buildDate}
 * @copyright ${copyright}
 * @license ${pkgJson.license}
 * @see [Github](${pkgJson.homepage})
 */`;

  return banner;
};
