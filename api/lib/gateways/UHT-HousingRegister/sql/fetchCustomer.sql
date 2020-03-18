WITH
  wlaneeds_cte
  AS
  (
    SELECT
      wlaneeds.app_ref,
      MAX(r_to) AS bedrooms
    FROM
      wlaneeds
    WHERE
        field_ref = 'num_bedrooms'
    GROUP BY
        wlaneeds.app_ref
  )
SELECT
	wlmember.*,
	wlapp.u_novalet_ref,
	wlapp.app_band,
	wlapp.post_code,
	wlapp.corr_addr,
	wlaneeds_cte.bedrooms
FROM
[dbo].[wlmember] AS wlmember
JOIN wlapp ON wlmember.app_ref = wlapp.app_ref
JOIN wlaneeds_cte ON wlapp.app_ref = wlaneeds_cte.app_ref
WHERE
	wlapp.app_ref = wlmember.app_ref
	AND wlmember.app_ref = @app_ref
	AND wlmember.person_no = @person_no