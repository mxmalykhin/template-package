import type { WarningHandlerWithDefault } from "rollup";

const silence = new Map();

export const onwarn: WarningHandlerWithDefault = (warning, warn) => {
  const ignore = silence.get(warning.code);

  if (ignore) {
    if (ignore.has(warning.message)) return;

    ignore.add(warning.message);
  } else {
    silence.set(warning.code, new Set().add(warning.message));
  }

  warn(warning);
};
