# Resultados reproduzíveis

> Gerado por `npm run report` a partir de dados totalmente fictícios. Os números demonstram as consultas; não representam uma empresa real.

## Receita mensal

Consulta: [01_monthly_revenue.sql](../sql/01_monthly_revenue.sql)

| month | delivered_orders | revenue_brl | average_order_value_brl |
| --- | --- | --- | --- |
| 2025-01 | 3 | 3212.77 | 1070.92 |
| 2025-02 | 7 | 12264.74 | 1752.11 |
| 2025-03 | 15 | 20696.09 | 1379.74 |
| 2025-04 | 12 | 16331.77 | 1360.98 |
| 2025-05 | 25 | 29842.14 | 1193.69 |
| 2025-06 | 38 | 50796.12 | 1336.74 |
| 2025-07 | 44 | 63027 | 1432.43 |
| 2025-08 | 55 | 67897.94 | 1234.51 |
| 2025-09 | 68 | 81073.79 | 1192.26 |
| 2025-10 | 93 | 102322.16 | 1100.24 |
| 2025-11 | 125 | 161040.45 | 1288.32 |
| 2025-12 | 117 | 138328.22 | 1182.29 |

## Margem por categoria

Consulta: [02_category_margin.sql](../sql/02_category_margin.sql)

| category | revenue_brl | cost_brl | gross_margin_pct |
| --- | --- | --- | --- |
| livros | 128806.66 | 74211.56 | 42.39 |
| esporte | 165313.72 | 96525.79 | 41.61 |
| papelaria | 161926.63 | 94916.99 | 41.38 |
| eletronicos | 122779.01 | 77201.6 | 37.12 |
| casa | 168007.15 | 107582.11 | 35.97 |

## Clientes recorrentes

Consulta: [03_repeat_customers.sql](../sql/03_repeat_customers.sql)

| active_customers | repeat_customers | repeat_rate_pct |
| --- | --- | --- |
| 189 | 166 | 87.83 |

## Prazo de entrega por estado

Consulta: [04_delivery_sla.sql](../sql/04_delivery_sla.sql)

| state | delivered_orders | average_delivery_days | late_delivery_pct |
| --- | --- | --- | --- |
| MG | 65 | 7.42 | 70.77 |
| GO | 77 | 6.9 | 67.53 |
| SP | 76 | 7.03 | 67.11 |
| RJ | 69 | 7.1 | 63.77 |
| SC | 94 | 6.59 | 56.38 |
| PR | 102 | 7.28 | 54.9 |
| BA | 54 | 6.52 | 53.7 |
| PE | 65 | 6.75 | 52.31 |

## Retenção por coorte

Consulta: [05_cohort_retention.sql](../sql/05_cohort_retention.sql)

| cohort_month | months_after_signup | active_customers | cohort_size | retention_pct |
| --- | --- | --- | --- | --- |
| 2025-01 | 0 | 3 | 19 | 15.79 |
| 2025-01 | 1 | 4 | 19 | 21.05 |
| 2025-01 | 2 | 7 | 19 | 36.84 |
| 2025-01 | 3 | 3 | 19 | 15.79 |
| 2025-02 | 0 | 3 | 20 | 15 |
| 2025-02 | 1 | 4 | 20 | 20 |
| 2025-02 | 2 | 2 | 20 | 10 |
| 2025-02 | 3 | 4 | 20 | 20 |
| 2025-03 | 0 | 3 | 12 | 25 |
| 2025-03 | 1 | 5 | 12 | 41.67 |
| 2025-03 | 2 | 4 | 12 | 33.33 |
| 2025-03 | 3 | 2 | 12 | 16.67 |
