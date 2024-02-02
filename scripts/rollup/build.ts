import { execSync } from 'child_process';

import path from 'node:path';
import type { OutputOptions, RollupOptions } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { nodeExternals } from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

import { getExternals } from '@repo/rollup/options/input/external';
import { getInput } from '@repo/rollup/options/input/input';
import {
  dist,
  distCjs,
  distEsm,
  distIife,
  distTypes,
  distUmd,
  isDebug,
  isProduction,
  now,
  pkgJson,
} from '@repo/scripts/constants';
import { getBanner } from '@repo/scripts/rollup/options/output/banner';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';

type BuildModules = 'esm' | 'cjs' | 'umd' | 'iife';

function getGitVersion(): string {
  try {
    return `${execSync('git rev-parse --abbrev-ref HEAD').toString().trim()}-${execSync('git rev-parse --short HEAD').toString().trim()}`;
  } catch (error) {
    console.error('Error getting git version:', error);
    return 'unknown';
  }
}

function createPlugins(
  isMultiInput: boolean,
  format: BuildModules,
  minify: boolean
) {
  const tsPlugin =
    isProduction ?
      typescript({
        tsconfig: './tsconfig.dist.json',
        clean: true,
      })
    : esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        minify: false,
        sourceMap: true,
        target: 'es2018',
      });

  const basePlugins = [
    nodeExternals(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV ?? 'production'
        ),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
        'process.env.VERSION': JSON.stringify(getGitVersion()),
        'process.env.BUILD_DATE': JSON.stringify(now.toISOString()),
      },
    }),
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.node'],
    }),
    commonjs({ sourceMap: !isProduction }),
    tsPlugin,
    json({ compact: true }),
    url(),
  ];

  if (isDebug && (format === 'cjs' || format === 'esm')) {
    basePlugins.push(
      visualizer({
        filename: path.resolve(dist, `bundle-stats-${format}.html`),
      })
    );
  }

  if (isProduction && minify) {
    basePlugins.push(terser());
  }

  return basePlugins;
}

function createOutputOptions(
  isMultiInput: boolean,
  format: BuildModules,
  minify: boolean
): OutputOptions {
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
      preserveModules: isMultiInput,
    },
    cjs: {
      preserveModules: isMultiInput,
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
    ...moduleOutputOptions[format],
  } as OutputOptions;
}

function generateRollupConfigs() {
  const formats: BuildModules[] = ['esm', 'cjs', 'umd', 'iife'];
  const isMultiInput = true;

  const input = getInput(isMultiInput);

  const configs: RollupOptions[] = [];

  formats.forEach((format) => {
    const minifyOptions = isProduction ? [false, true] : [false];

    minifyOptions.forEach((minify) => {
      configs.push({
        input,
        external: getExternals,
        plugins: createPlugins(isMultiInput, format, minify),
        output: createOutputOptions(isMultiInput, format, minify),
      });
    });
  });

  configs.push({
    input,
    output: { file: path.join(dist, 'index.d.ts'), format: 'es' },
    plugins: [dts()],
  });

  if (isMultiInput) {
    configs.push({
      input,
      output: { dir: distTypes, format: 'es', preserveModules: true },
      plugins: [dts()],
    });
  }

  return configs;
}

export default generateRollupConfigs;
