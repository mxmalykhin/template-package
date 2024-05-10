import * as fs from "fs-extra";
import { glob } from "glob";

export async function copyFile(src: string, dest: string) {
  await fs.copy(src, dest);
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

export async function writeFile(filePath: string, content: string) {
  await fs.writeFile(filePath, content, "utf8");
}

export async function getFiles(pattern: string): Promise<string[]> {
  return glob(pattern);
}
