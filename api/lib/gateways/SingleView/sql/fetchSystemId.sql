SELECT customer_links.remote_id FROM customer_links, customers, systems 
WHERE systems.id = customer_links.system_id AND customers.id = customer_links.customer_id AND customers.id = $1 AND systems.name = $2
