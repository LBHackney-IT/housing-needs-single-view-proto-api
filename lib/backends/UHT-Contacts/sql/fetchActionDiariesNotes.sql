SELECT
	araction.*
FROM
	araction
	JOIN tenagree ON tenagree.tag_ref = araction.tag_ref
	WHERE house_ref = @house_ref