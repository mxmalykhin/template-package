import { type RollupBuild } from 'rollup';

export const foo1 = (text = '') => `[module1] -> [foo1] ${text}`;

const fooDefault = (test = '') => `[module1] -> [fooDefault] ${test}`;

console.debug('[module1] running (side-effect)');

export type TestTypeInModule1 = 'asd' | 'asd22' | false;

export function fooSideEffect() {
  console.debug(
    '[module1] -> [fooSideEffect] running (side-effect in exported function)'
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const build: RollupBuild | undefined = undefined;

export function fooUnusedFunc(): RollupBuild {
  const a = {} as RollupBuild;

  return a;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fooUnusedSideEffectFunc() {
  console.debug('[module1] -> [fooUnusedSideEffectFunc] running (side-effect)');
}

export function fooExportedSideEffectFunc() {
  console.debug(
    '[module1] -> [fooExportedSideEffectFunc] running (side-effect)'
  );
}

export default fooDefault;
