import { entry, src } from "@repo/scripts/constants";
import { glob } from "glob";
import type { InputOption } from "rollup";

const inputRoot = entry;

export const getInput = (isMulti: boolean): InputOption => {
  if (isMulti) {
    const files = glob.sync("**/*", {
      cwd: src,
      absolute: true,
      nodir: true,
    });

    console.debug("Find inputs:", files);

    return files;
  }

  return inputRoot;
};
