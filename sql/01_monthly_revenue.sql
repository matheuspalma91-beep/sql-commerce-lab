WITH delivered_orders AS (
  SELECT
    o.order_id,
    o.order_date,
    SUM(oi.quantity * oi.unit_price_cents * (100 - oi.discount_pct) / 100.0) AS revenue_cents
  FROM orders AS o
  JOIN order_items AS oi USING (order_id)
  WHERE o.status = 'delivered'
  GROUP BY o.order_id, o.order_date
)
SELECT
  strftime('%Y-%m', order_date) AS month,
  COUNT(*) AS delivered_orders,
  ROUND(SUM(revenue_cents) / 100.0, 2) AS revenue_brl,
  ROUND(AVG(revenue_cents) / 100.0, 2) AS average_order_value_brl
FROM delivered_orders
GROUP BY month
ORDER BY month;

