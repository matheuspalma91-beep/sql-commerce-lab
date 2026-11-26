import path from "node:path";
import { executeQuery, getProjectRoot, openDatabase, readProjectFile } from "../lib/database.mjs";

const relativePath = process.argv[2];
if (!relativePath || !relativePath.startsWith("sql/") || path.extname(relativePath) !== ".sql") {
  console.error("Uso: npm run query -- sql/01_monthly_revenue.sql");
  process.exit(1);
}

const db = await openDatabase();
const rows = executeQuery(db, readProjectFile(relativePath));
console.table(rows);
db.close();
console.log(`Consulta executada a partir de ${path.join(getProjectRoot(), relativePath)}`);

