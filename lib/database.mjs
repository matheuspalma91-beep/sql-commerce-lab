import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function openDatabase() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(projectRoot, "node_modules", "sql.js", "dist", file),
  });
  const db = new SQL.Database();
  db.run(readProjectFile("sql/00_schema.sql"));
  db.run(readProjectFile("data/seed.sql"));
  return db;
}

export function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

export function executeQuery(db, sql) {
  const [result] = db.exec(sql);
  if (!result) return [];

  return result.values.map((values) =>
    Object.fromEntries(result.columns.map((column, index) => [column, values[index]])),
  );
}

export function getProjectRoot() {
  return projectRoot;
}

