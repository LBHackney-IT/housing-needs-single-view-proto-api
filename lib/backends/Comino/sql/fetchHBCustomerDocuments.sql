SELECT
	CCDocument.*
FROM
	CCDocument
JOIN BENCLAIM ON CCDocument.BenPersonReference = BENCLAIM.PERSONREFERENCE
WHERE
	BENCLAIM.CLAIMREFERENCE = @claim_id
ORDER BY DocDate DESC;