import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SEED = 20261126;

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function choose(random, values) {
  return values[Math.floor(random() * values.length)];
}

function weightedChoice(random, choices) {
  const roll = random();
  let total = 0;
  for (const [value, weight] of choices) {
    total += weight;
    if (roll < total) return value;
  }
  return choices.at(-1)[0];
}

function addDays(date, days) {
  const copy = new Date(`${date}T00:00:00Z`);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy.toISOString().slice(0, 10);
}

function dateBetween(random, start, dayRange) {
  return addDays(start, Math.floor(random() * dayRange));
}

function daysInclusive(start, end) {
  const startMs = Date.parse(`${start}T00:00:00Z`);
  const endMs = Date.parse(`${end}T00:00:00Z`);
  return Math.floor((endMs - startMs) / 86_400_000) + 1;
}

function quote(value) {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}

function insert(table, columns, rows) {
  const values = rows.map((row) => `  (${row.map(quote).join(", ")})`).join(",\n");
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${values};`;
}

export function buildSeedSql(seed = DEFAULT_SEED) {
  const random = createRandom(seed);
  const states = ["SP", "RJ", "MG", "PR", "BA", "SC", "PE", "GO"];
  const channels = ["organic", "paid_search", "social", "referral"];
  const categories = ["casa", "eletronicos", "esporte", "livros", "papelaria"];
  const methods = ["pix", "credit_card", "debit_card", "boleto"];

  const customers = Array.from({ length: 200 }, (_, index) => [
    `CUST${String(index + 1).padStart(3, "0")}`,
    dateBetween(random, "2025-01-01", 304),
    choose(random, states),
    choose(random, channels),
  ]);

  const products = Array.from({ length: 30 }, (_, index) => {
    const category = categories[index % categories.length];
    const cost = 1500 + Math.floor(random() * 23500);
    const markup = 1.35 + random() * 0.85;
    return [
      `PROD${String(index + 1).padStart(3, "0")}`,
      `Produto fictício ${String(index + 1).padStart(2, "0")}`,
      category,
      cost,
      Math.round(cost * markup),
    ];
  });

  const orders = [];
  const items = [];
  const payments = [];

  for (let index = 0; index < 720; index += 1) {
    const orderId = `ORD${String(index + 1).padStart(4, "0")}`;
    const customer = choose(random, customers);
    const orderDate = dateBetween(random, customer[1], daysInclusive(customer[1], "2025-12-31"));
    const status = weightedChoice(random, [
      ["delivered", 0.84],
      ["canceled", 0.08],
      ["shipped", 0.04],
      ["pending", 0.04],
    ]);
    const promisedDate = addDays(orderDate, 3 + Math.floor(random() * 6));
    const deliveredDate = status === "delivered" ? addDays(promisedDate, Math.floor(random() * 8) - 2) : null;
    orders.push([orderId, customer[0], orderDate, status, promisedDate, deliveredDate]);

    const productCount = 1 + Math.floor(random() * 4);
    const chosenProducts = new Set();
    while (chosenProducts.size < productCount) {
      chosenProducts.add(Math.floor(random() * products.length));
    }
    for (const productIndex of chosenProducts) {
      const product = products[productIndex];
      items.push([
        orderId,
        product[0],
        1 + Math.floor(random() * 3),
        product[4],
        choose(random, [0, 0, 0, 5, 10, 15]),
      ]);
    }

    if (status !== "canceled") {
      const method = choose(random, methods);
      payments.push([
        `PAY${String(payments.length + 1).padStart(4, "0")}`,
        orderId,
        method,
        method === "credit_card" ? 1 + Math.floor(random() * 6) : 1,
      ]);
    }
  }

  const sql = [
    "-- Dados 100% fictícios. Gerados deterministicamente; não representam pessoas ou empresas reais.",
    `-- Seed: ${seed}`,
    "PRAGMA foreign_keys = ON;",
    "BEGIN TRANSACTION;",
    insert("customers", ["customer_id", "signup_date", "state", "acquisition_channel"], customers),
    insert("products", ["product_id", "product_name", "category", "unit_cost_cents", "list_price_cents"], products),
    insert("orders", ["order_id", "customer_id", "order_date", "status", "promised_date", "delivered_date"], orders),
    insert("order_items", ["order_id", "product_id", "quantity", "unit_price_cents", "discount_pct"], items),
    insert("payments", ["payment_id", "order_id", "method", "installments"], payments),
    "COMMIT;",
  ].join("\n\n");
  return `${sql}\n`;
}

function isDirectRun() {
  return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const target = path.join(projectRoot, "data", "seed.sql");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buildSeedSql(), "utf8");
  console.log(`Dataset fictício gerado em ${target}`);
}

