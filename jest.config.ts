import { pathsToModuleNameMapper } from 'ts-jest';

import type { Config } from '@jest/types';

import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx)'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/@types/**/*.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
