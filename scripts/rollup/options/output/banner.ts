import { copyright, now, pkgJson } from '@repo/scripts/constants';
import type { OutputOptions } from 'rollup';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getBanner: Extract<OutputOptions['banner'], Function> = (
  chunk
) => {
  const buildDate = now.toISOString().slice(0, 10);

  const banner = `/**
 * @module ${pkgJson.name}
 * @version ${pkgJson.version}
 * @description ${pkgJson.description}
 * @file ${chunk.fileName}
 * @date ${buildDate}
 * @copyright ${copyright}
 * @license ${pkgJson.license}
 * @see [Github](${pkgJson.homepage})
 */`;

  return banner;
};
