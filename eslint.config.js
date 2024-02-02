import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  {
    ignores: [
      'dist/**',
      "publish-package/**",
      'node_modules/**',
      'coverage/**',
      'CHANGELOG.md',
      '!/.github',
      '!/.*.js',
      '.*.cjs',
      '*.config.js',
      '**/.idea',
      '**/*.min.*',
      '**/LICENSE*',
      '**/__snapshots__',
    ],
  },
  {
    ...compat.extends('plugin:@typescript-eslint/strict-type-checked')[0],
  },
  {
    ...compat.extends('plugin:@typescript-eslint/stylistic-type-checked')[0],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    // settings: {
    //   "import/resolver": {
    //     typescript: {
    //       project,
    //     },
    //   },
    // },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals['shared-node-browser'],
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        allowAutomaticSingleRunInference: true,
        cacheLifetime: {
          // we pretty well never create/change tsconfig structure - so no need to ever evict the cache
          // in the rare case that we do - just need to manually restart their IDE.
          glob: 'Infinity',
        },
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'no-console': [
        'error',
        {
          allow: [
            'debug',
            'warn',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupEnd',
            'groupCollapsed',
            'table',
            'error',
            'profile',
            'profileEnd',
            'timeStamp',
          ],
        },
      ],
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false,
          'ts-nocheck': false,
          'ts-check': false,
          minimumDescriptionLength: 5,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
