import fs from "node:fs";
import path from "node:path";
import { executeQuery, getProjectRoot, openDatabase, readProjectFile } from "../lib/database.mjs";

const reports = [
  ["01_monthly_revenue.sql", "Receita mensal"],
  ["02_category_margin.sql", "Margem por categoria"],
  ["03_repeat_customers.sql", "Clientes recorrentes"],
  ["04_delivery_sla.sql", "Prazo de entrega por estado"],
  ["05_cohort_retention.sql", "Retenção por coorte"],
];

function markdownTable(rows) {
  if (rows.length === 0) return "_Sem resultados._";
  const columns = Object.keys(rows[0]);
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows
    .slice(0, 12)
    .map((row) => `| ${columns.map((column) => row[column]).join(" | ")} |`)
    .join("\n");
  return `${header}\n${divider}\n${body}`;
}

const db = await openDatabase();
const sections = reports.map(([file, title]) => {
  const rows = executeQuery(db, readProjectFile(`sql/${file}`));
  return `## ${title}\n\nConsulta: [${file}](../sql/${file})\n\n${markdownTable(rows)}`;
});
db.close();

const output = `${[
  "# Resultados reproduzíveis",
  "> Gerado por `npm run report` a partir de dados totalmente fictícios. Os números demonstram as consultas; não representam uma empresa real.",
  ...sections,
].join("\n\n")}\n`;

const target = path.join(getProjectRoot(), "docs", "results.md");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, output, "utf8");
console.log(`Relatório atualizado em ${target}`);

