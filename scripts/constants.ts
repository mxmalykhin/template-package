import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pkgJson from '@repo/package.json' assert { type: 'json' };

export const __filename = fileURLToPath(new URL('.', import.meta.url));
export const __dirname = path.dirname(__filename);

export const root = path.resolve(__dirname);

export const nodeModules = path.resolve(root, 'node_modules');
export const tempTypes = path.resolve(root, 'temp-types');

export const pkg = path.resolve(root, 'package.json');
export const entry = path.resolve(root, 'src/index.ts');
export const src = path.resolve(root, 'src');

export const distTsConfig = path.resolve(root, 'tsconfig.dist.json');
export const dist = path.resolve(root, 'dist');
export const tsCache = path.resolve(root, 'node_modules', '.rts2_cache');
export const distCjs = path.resolve(dist, 'cjs');
export const distEsm = path.resolve(dist, 'esm');
export const distUmd = path.resolve(dist, 'umd');
export const distIife = path.resolve(dist, 'iife');

const _a = 'asd';

console.debug(this);

export const targetBrowser = 'es5';
export const targetNode = 'es2019';

export const tsConfig = path.resolve(root, 'tsconfig.json');
export const isProduction = process.env['NODE_ENV'] === 'production';
export const isDebug = Boolean(process.env['DEBUG']);
export const now = new Date();

export const copyright = fs
  .readFileSync('./LICENSE', 'utf-8')
  .split(/\n/g)
  .filter((line) => /^Copyright\s+/.test(line))
  .map((line) => line.replace(/^Copyright\s+/, ''))
  .join(', ');

export const extractorBin = path.resolve(
  root,
  'node_modules/.bin/api-extractor'
);

export { pkgJson };
