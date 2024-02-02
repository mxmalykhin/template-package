import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import pkgJson from '@repo/package.json' assert { type: 'json' };

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const root = path.resolve(__dirname, '..');

export const pkg = path.resolve(root, 'package.json');
export const entry = path.resolve(root, 'src/index.ts');
export const src = path.resolve(root, 'src');
export const dist = path.resolve(root, 'dist');
export const distCjs = path.resolve(root, 'dist/cjs');
export const distEsm = path.resolve(root, 'dist');
export const distUmd = path.resolve(root, 'dist/umd');
export const distIife = path.resolve(root, 'dist/iife');
export const distTypes = path.resolve(root, 'dist/types');
export const tsConfig = path.resolve(root, 'tsconfig.json');
export const isProduction = process.env.NODE_ENV === 'production';
export const isDebug = Boolean(process.env.DEBUG);
export const now = new Date();

export const copyright = fs
  .readFileSync('./LICENSE', 'utf-8')
  .split(/\n/g)
  .filter((line) => /^Copyright\s+/.test(line))
  .map((line) => line.replace(/^Copyright\s+/, ''))
  .join(', ');

export { pkgJson };
