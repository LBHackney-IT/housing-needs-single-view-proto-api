CREATE TABLE customers
(
  id serial PRIMARY KEY,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE systems
(
  id serial PRIMARY KEY,
  name varchar(32) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_links
(
  id serial PRIMARY KEY,
  customer_id integer NOT NULL,
  system_id integer NOT NULL,
  remote_id varchar(30) NOT NULL,
  first_name varchar(30),
  last_name varchar(50),
  address varchar(200),
  nino varchar(11),
  dob timestamp,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT customer_links_customer_fkey FOREIGN KEY (customer_id) REFERENCES customers (id)
  MATCH SIMPLE ON
  UPDATE NO ACTION ON
  DELETE NO ACTION,
  CONSTRAINT customer_links_systems_fkey
  FOREIGN KEY
  (system_id) REFERENCES systems
  (id) MATCH SIMPLE ON
  UPDATE NO ACTION ON
  DELETE NO ACTION
);

  INSERT INTO systems
    (name)
  VALUES
    ('UHT-Contacts');

  INSERT INTO systems
    (name)
  VALUES
    ('UHT-HousingRegister');

  INSERT INTO systems
    (name)
  VALUES
    ('UHW');

  INSERT INTO systems
    (name)
  VALUES
    ('JIGSAW');

  INSERT INTO systems
    (name)
  VALUES
    ('ACADEMY-Benefits');

  INSERT INTO systems
    (name)
  VALUES
    ('ACADEMY-CouncilTax');

  INSERT INTO systems
    (name)
  VALUES
    ('COMINO');

