SELECT
  *
FROM
  vulnerabilities
WHERE
  customer_id = $1
