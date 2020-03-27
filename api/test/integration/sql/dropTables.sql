ALTER TABLE customer_links DROP CONSTRAINT IF EXISTS customer_links_customer_fkey;

ALTER TABLE customer_links DROP CONSTRAINT IF EXISTS customer_links_systems_fkey;

ALTER TABLE vulnerabilities DROP CONSTRAINT IF EXISTS vulnerabilities_customer_fkey;

DROP TABLE IF EXISTS customer_links;

DROP TABLE IF EXISTS systems;

DROP TABLE IF EXISTS customers;

DROP TABLE IF EXISTS vulnerabilities;
