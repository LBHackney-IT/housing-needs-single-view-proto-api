INSERT INTO customer_links
  (customer_id, system_id, remote_id, first_name, last_name, address, dob, nino)
VALUES
  ($1,
    (SELECT id
    FROM systems
    WHERE name = $2),
    $3,
    $4,
    $5,
    $6,
    $7,
    $8)
