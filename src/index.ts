import { fooSideEffect, fooUnusedFunc } from './module1';

export const foo = (text = '') => `[index] -> [foo] ${text}`;

const foo2 = (text = '') => `[index] -> [foo2] ${text}`;

const foo3 = (text = '') => `[index] -> [foo3] ${text}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const foo4 = (text = '') => `[index] -> [foo4] ${text}`;

export default {
  foo2,
  foo3,
  fooSideEffect,
  fooUnusedFunc,
  // testchild: { testModule1 },
};
