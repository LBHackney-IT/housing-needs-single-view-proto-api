INSERT INTO customer_links
  (customer_id, system_id, remote_id, first_name, last_name, address, dob, nino)
VALUES
  ($
(customer_id),
(SELECT id
FROM systems
WHERE name = $
(system_name)), $
(remote_id), $
(first_name), $
(last_name), $
(address), $
(dob), $
(nino))