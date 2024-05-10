import { extractorBin } from "@repo/constants";
import { execa } from "execa";

export default async function apiExtractor() {
  console.debug("Running api-extractor...");
  await execa(extractorBin, ["run", "--local"], { stdio: "inherit" });
}
