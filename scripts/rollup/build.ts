import { createRequire } from 'node:module';
import path from 'node:path';

import {
  dist,
  distCjs,
  distEsm,
  distIife,
  distTsConfig,
  distUmd,
  isDebug,
  isProduction,
  pkgJson,
  root,
  src,
  targetBrowser,
  targetNode,
} from '@/scripts/constants';
import { getExternals } from '@/scripts/rollup/options/input/external';
import { getInput } from '@/scripts/rollup/options/input/input';
import { getBanner } from '@/scripts/rollup/options/output/banner';
import clear from '@/scripts/rollup/plugins/clear';
import { getCommitHash } from '@/scripts/utils/getCommitHash';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import filesize from 'rollup-plugin-filesize';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { nodeExternals } from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

const cjsRequire = createRequire(import.meta.url);
const tspCompiler = cjsRequire('ts-patch/compiler');

type BuildModules = 'esm' | 'cjs' | 'umd' | 'iife';

function isTargetingBrowser(format: BuildModules): boolean {
  return format !== 'cjs';
}

function createPlugins(isMultiInput: boolean, format: BuildModules, minify: boolean) {
  const isBrowser = isTargetingBrowser(format);
  // FIXME
  const target = isBrowser ? targetBrowser : targetNode;

  const commitHash = getCommitHash();
  const buildDate = new Date().toISOString();

  const tsPlugin = isProduction
    ? typescript({
        tsconfig: distTsConfig,
        typescript: tspCompiler,
        clean: true,
      })
    : esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        minify: false,
        sourceMap: true,
        target: ['node20'],
        tsconfig: distTsConfig,
      });

  const basePlugins = [
    nodeExternals(),
    injectProcessEnv({
      // biome-ignore lint/complexity/useLiteralKeys: FIXME
      NODE_ENV: process.env['NODE_ENV'] ?? 'production',
      COMMIT_HASH: commitHash,
      BUILD_DATE: buildDate,
      // biome-ignore lint/complexity/useLiteralKeys: FIXME
      DEBUG: JSON.stringify(process.env['DEBUG']),
    }),
    nodeResolve({
      browser: isBrowser,
      preferBuiltins: true,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.node'],
    }),
    tsPlugin,
    // rollup-plugin-esbuild doesn't support auto resolve tsconfig paths (https://github.com/egoist/rollup-plugin-esbuild/issues/70)
    // but rollup-plugin-typescript2 does, therefore we use "@rollup/plugin-alias" in dev mode when esbuild compiles (under @rollup/plugin-alias it uses rollup-plugin-typescript2 too but for resolve tsconfig paths)
    !isProduction &&
      alias({
        entries: [{ find: '@', replacement: root }],
      }),
    commonjs({ sourceMap: !isProduction }),
    json({ compact: true }),
    url(),
  ].filter(Boolean) as Plugin[];

  if (isDebug && (format === 'cjs' || format === 'esm')) {
    basePlugins.push(
      visualizer({
        filename: path.resolve(dist, `bundle-stats-${format}.html`),
      }),
    );
  }

  if (isProduction && minify) {
    basePlugins.push(terser());
    basePlugins.push(filesize());
  }

  return basePlugins;
}

function createOutputOptions(isMultiInput: boolean, format: BuildModules, minify: boolean): OutputOptions {
  const extensionMap: Record<BuildModules, string> = {
    esm: '.js',
    cjs: '.cjs',
    umd: '.js',
    iife: '.js',
  };

  const formatDirMap: Record<BuildModules, string> = {
    esm: distEsm,
    cjs: distCjs,
    umd: distUmd,
    iife: distIife,
  };

  const moduleOutputOptions = {
    esm: {
      preserveModulesRoot: src,
      preserveModules: isMultiInput,
      exports: 'named',
    },
    cjs: {
      preserveModulesRoot: src,
      preserveModules: isMultiInput,
      exports: 'named',
    },
    umd: {
      name: pkgJson.name,
      globals: {},
    },
    iife: {
      name: pkgJson.name,
      extend: true,
      globals: {},
    },
  } satisfies Record<BuildModules, OutputOptions>;

  const fileNameSuffix = minify ? '.min' : '';

  return {
    format,
    dir: formatDirMap[format],
    entryFileNames: `[name]${fileNameSuffix}${extensionMap[format]}`,
    sourcemap: !isProduction,
    banner: getBanner,
    indent: format !== 'esm',
    ...moduleOutputOptions[format],
  } as OutputOptions;
}

async function generateRollupConfigs() {
  const formats: BuildModules[] = ['esm', 'cjs'];
  const isMultiInput = true;

  const input = getInput(isMultiInput);
  const configs: RollupOptions[] = [];

  clear({ targets: [dist] });

  for (const format of formats) {
    // const minifyOptions = isProduction ? [false, true] : [false];
    const minifyOptions = [false];

    for (const minify of minifyOptions) {
      configs.push({
        input,
        cache: false,
        external: getExternals,
        plugins: createPlugins(isMultiInput, format, minify),
        output: createOutputOptions(isMultiInput, format, minify),
      });
    }
  }

  return configs;
}

export default generateRollupConfigs;
