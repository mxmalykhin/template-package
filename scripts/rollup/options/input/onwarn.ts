import type { WarningHandlerWithDefault } from 'rollup';

const silence = new Map();

export const onwarn: WarningHandlerWithDefault = function (warning, warn) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const ignore = silence.get(warning.code);

  if (ignore) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (ignore.has(warning.message)) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ignore.add(warning.message);
  } else {
    silence.set(warning.code, new Set().add(warning.message));
  }

  warn(warning);
};
