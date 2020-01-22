SELECT 
    customer_links.*, systems.name as system_name 
FROM 
    customer_links
    JOIN systems ON systems.id = customer_links.system_id 
    WHERE customer_id = @customer_id
    