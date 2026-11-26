WITH delivered_months AS (
  SELECT DISTINCT
    c.customer_id,
    strftime('%Y-%m', c.signup_date) AS cohort_month,
    strftime('%Y-%m', o.order_date) AS order_month,
    (
      (CAST(strftime('%Y', o.order_date) AS INTEGER) - CAST(strftime('%Y', c.signup_date) AS INTEGER)) * 12
      + CAST(strftime('%m', o.order_date) AS INTEGER)
      - CAST(strftime('%m', c.signup_date) AS INTEGER)
    ) AS months_after_signup
  FROM customers AS c
  JOIN orders AS o USING (customer_id)
  WHERE o.status = 'delivered' AND o.order_date >= c.signup_date
),
cohort_sizes AS (
  SELECT strftime('%Y-%m', signup_date) AS cohort_month, COUNT(*) AS cohort_size
  FROM customers
  GROUP BY cohort_month
)
SELECT
  dm.cohort_month,
  dm.months_after_signup,
  COUNT(DISTINCT dm.customer_id) AS active_customers,
  cs.cohort_size,
  ROUND(100.0 * COUNT(DISTINCT dm.customer_id) / cs.cohort_size, 2) AS retention_pct
FROM delivered_months AS dm
JOIN cohort_sizes AS cs USING (cohort_month)
WHERE dm.months_after_signup BETWEEN 0 AND 3
GROUP BY dm.cohort_month, dm.months_after_signup, cs.cohort_size
ORDER BY dm.cohort_month, dm.months_after_signup;

