import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import { gitignore } from 'eslint-flat-config-gitignore';
import deprecationPlugin from 'eslint-plugin-deprecation';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import jestPlugin from 'eslint-plugin-jest';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const root = path.resolve(__dirname);
const tsConfig = path.resolve(root, 'tsconfig.json');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  await gitignore(__dirname),
  {
    // note - intentionally uses computed syntax to make it easy to sort the keys
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['deprecation']: deprecationPlugin,
      ['eslint-comments']: eslintCommentsPlugin,
      ['jest']: jestPlugin,
      ['simple-import-sort']: simpleImportSortPlugin,
    },
  },
  {
    rules: {
      // deprecation
      'deprecation/deprecation': 'warn',

      // eslint-comments
      ...eslintCommentsPlugin.configs['recommended'].rules,

      // simple import sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },

    // config with just ignores is the replacement for `.eslintignore`
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/fixtures/**',
      '**/coverage/**',
      '**/__snapshots__/**',
      '**/.idea',
      '**/*.min.*',
      '**/LICENSE*',
      'jest.config.js',
    ],
  },

  // extends if is flat config
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // main config
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        cacheLifetime: {
          // we pretty well never create/change tsconfig structure - so no need to ever evict the cache
          // in the rare case that we do - just need to manually restart their IDE.
          // glob: 'Infinity',
        },
        sourceType: 'module',
        project: tsConfig,
        tsconfigRootDir: import.meta.dirname,
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

  // disable type checking for all js files
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      'deprecation/deprecation': 'off',
    },
  },

  {
    files: ['**/*.test.*', '**/test/**', '**/tests/**'],
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
  },

  prettierPluginRecommended
);
