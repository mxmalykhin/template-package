import prettierPlugin from 'eslint-plugin-prettier';

import { testing2 } from '@/folder-test/module3';

import { testing2 as testing2Relative } from './module3';

export const testing = false;

console.debug('module2', testing2, testing2Relative, prettierPlugin);

export { testing2 };
