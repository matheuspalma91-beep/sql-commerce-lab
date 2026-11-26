import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSeedSql } from "./generate-data.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(projectRoot, "data", "seed.sql");
const committed = fs.readFileSync(target, "utf8");
const generated = buildSeedSql();

if (committed !== generated) {
  console.error("data/seed.sql está desatualizado. Execute `npm run data`.");
  process.exitCode = 1;
} else {
  console.log("Dataset reproduzível: data/seed.sql está atualizado.");
}

