SELECT
  c.state,
  COUNT(*) AS delivered_orders,
  ROUND(AVG(julianday(o.delivered_date) - julianday(o.order_date)), 2) AS average_delivery_days,
  ROUND(
    100.0 * AVG(CASE WHEN o.delivered_date > o.promised_date THEN 1.0 ELSE 0.0 END),
    2
  ) AS late_delivery_pct
FROM orders AS o
JOIN customers AS c USING (customer_id)
WHERE o.status = 'delivered'
GROUP BY c.state
ORDER BY late_delivery_pct DESC, c.state;

