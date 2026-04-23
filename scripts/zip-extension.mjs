#!/usr/bin/env node
/**
 * Packs extension/ into public/brewery-extension.zip (manifest at zip root)
 * for manual “Load unpacked” installs. Run via npm run zip-extension or prebuild.
 */

import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const extDir = path.join(root, "extension");
const publicDir = path.join(root, "public");
const zipPath = path.join(publicDir, "brewery-extension.zip");

await mkdir(publicDir, { recursive: true });

await new Promise((resolve, reject) => {
  const output = createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✓ brewery-extension.zip (${archive.pointer()} bytes)`);
    resolve();
  });
  archive.on("error", reject);
  archive.on("warning", (err) => {
    if (err.code !== "ENOENT") console.warn(err);
  });

  archive.pipe(output);
  archive.directory(`${extDir}${path.sep}`, false);
  archive.finalize();
});
