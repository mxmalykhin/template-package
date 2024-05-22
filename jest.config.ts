import type { Config } from '@jest/types';

import tsBase from './tsconfig.base.json' assert { type: 'json' };

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['<rootDir>/tests'],
  modulePaths: [tsBase.compilerOptions.baseUrl],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
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
