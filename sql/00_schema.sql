PRAGMA foreign_keys = ON;

CREATE TABLE customers (
  customer_id TEXT PRIMARY KEY,
  signup_date TEXT NOT NULL CHECK (date(signup_date) IS NOT NULL),
  state TEXT NOT NULL CHECK (length(state) = 2),
  acquisition_channel TEXT NOT NULL CHECK (
    acquisition_channel IN ('organic', 'paid_search', 'social', 'referral')
  )
);

CREATE TABLE products (
  product_id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit_cost_cents INTEGER NOT NULL CHECK (unit_cost_cents >= 0),
  list_price_cents INTEGER NOT NULL CHECK (list_price_cents > unit_cost_cents)
);

CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(customer_id),
  order_date TEXT NOT NULL CHECK (date(order_date) IS NOT NULL),
  status TEXT NOT NULL CHECK (status IN ('pending', 'shipped', 'delivered', 'canceled')),
  promised_date TEXT NOT NULL CHECK (date(promised_date) IS NOT NULL),
  delivered_date TEXT CHECK (delivered_date IS NULL OR date(delivered_date) IS NOT NULL),
  CHECK (
    (status = 'delivered' AND delivered_date IS NOT NULL)
    OR (status <> 'delivered' AND delivered_date IS NULL)
  )
);

CREATE TABLE order_items (
  order_id TEXT NOT NULL REFERENCES orders(order_id),
  product_id TEXT NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  discount_pct INTEGER NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE payments (
  payment_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(order_id),
  method TEXT NOT NULL CHECK (method IN ('pix', 'credit_card', 'debit_card', 'boleto')),
  installments INTEGER NOT NULL CHECK (installments BETWEEN 1 AND 12)
);

CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
CREATE INDEX idx_orders_status_date ON orders (status, order_date);
CREATE INDEX idx_products_category ON products (category);

