WITH customer_orders AS (
  SELECT customer_id, COUNT(*) AS delivered_orders
  FROM orders
  WHERE status = 'delivered'
  GROUP BY customer_id
)
SELECT
  COUNT(*) AS active_customers,
  SUM(CASE WHEN delivered_orders >= 2 THEN 1 ELSE 0 END) AS repeat_customers,
  ROUND(
    100.0 * SUM(CASE WHEN delivered_orders >= 2 THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) AS repeat_rate_pct
FROM customer_orders;

