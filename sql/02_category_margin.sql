SELECT
  p.category,
  ROUND(SUM(oi.quantity * oi.unit_price_cents * (100 - oi.discount_pct) / 100.0) / 100.0, 2) AS revenue_brl,
  ROUND(SUM(oi.quantity * p.unit_cost_cents) / 100.0, 2) AS cost_brl,
  ROUND(
    100.0 * (
      SUM(oi.quantity * oi.unit_price_cents * (100 - oi.discount_pct) / 100.0)
      - SUM(oi.quantity * p.unit_cost_cents)
    ) / SUM(oi.quantity * oi.unit_price_cents * (100 - oi.discount_pct) / 100.0),
    2
  ) AS gross_margin_pct
FROM orders AS o
JOIN order_items AS oi USING (order_id)
JOIN products AS p USING (product_id)
WHERE o.status = 'delivered'
GROUP BY p.category
ORDER BY gross_margin_pct DESC;

