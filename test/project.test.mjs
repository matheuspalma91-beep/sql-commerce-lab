import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { executeQuery, getProjectRoot, openDatabase, readProjectFile } from "../lib/database.mjs";
import { buildSeedSql } from "../scripts/generate-data.mjs";

test("o dataset versionado é reproduzível", () => {
  const committed = fs.readFileSync(`${getProjectRoot()}/data/seed.sql`, "utf8");
  assert.equal(committed, buildSeedSql());
});

test("o schema carrega o conjunto fictício esperado", async () => {
  const db = await openDatabase();
  const counts = executeQuery(
    db,
    `SELECT
      (SELECT COUNT(*) FROM customers) AS customers,
      (SELECT COUNT(*) FROM products) AS products,
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COUNT(*) FROM order_items) AS order_items;`,
  );
  assert.deepEqual(counts[0].customers, 200);
  assert.deepEqual(counts[0].products, 30);
  assert.deepEqual(counts[0].orders, 720);
  assert.ok(counts[0].order_items > 720);
  db.close();
});

test("constraints rejeitam estados de pedido inconsistentes", async () => {
  const db = await openDatabase();
  assert.throws(() => {
    db.run(`INSERT INTO orders VALUES ('INVALID', 'CUST001', '2025-01-01', 'delivered', '2025-01-05', NULL);`);
  }, /CHECK constraint failed/);
  db.close();
});

test("pedidos ficam dentro do período fictício documentado", async () => {
  const db = await openDatabase();
  const range = executeQuery(
    db,
    "SELECT MIN(order_date) AS first_order, MAX(order_date) AS last_order FROM orders;",
  )[0];
  assert.ok(range.first_order >= "2025-01-01");
  assert.ok(range.last_order <= "2025-12-31");
  db.close();
});

test("as cinco consultas analíticas executam e retornam dados", async () => {
  const db = await openDatabase();
  for (let index = 1; index <= 5; index += 1) {
    const filename = fs
      .readdirSync(`${getProjectRoot()}/sql`)
      .find((name) => name.startsWith(`0${index}_`));
    const rows = executeQuery(db, readProjectFile(`sql/${filename}`));
    assert.ok(rows.length > 0, `${filename} deveria retornar linhas`);
  }
  db.close();
});

test("receita considera apenas pedidos entregues", async () => {
  const db = await openDatabase();
  const report = executeQuery(db, readProjectFile("sql/01_monthly_revenue.sql"));
  const delivered = executeQuery(db, "SELECT COUNT(*) AS count FROM orders WHERE status = 'delivered';")[0].count;
  const reported = report.reduce((total, row) => total + row.delivered_orders, 0);
  assert.equal(reported, delivered);
  db.close();
});

