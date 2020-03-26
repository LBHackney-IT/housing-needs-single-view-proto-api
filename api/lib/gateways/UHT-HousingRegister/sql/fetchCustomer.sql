WITH
  wlaneeds_temp
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
	wlapp.wl_status,
	wlapp.u_novalet_ref,
	wlapp.app_band,
	wlapp.post_code,
	wlapp.corr_addr,
 	ISNULL (wlaneeds_temp.bedrooms,0) AS bedrooms

	FROM
[dbo].[wlmember] AS wlmember
LEFT JOIN wlapp ON wlmember.app_ref = wlapp.app_ref
LEFT JOIN wlaneeds_temp ON wlapp.app_ref = wlaneeds_temp.app_ref
WHERE
	wlapp.app_ref = wlmember.app_ref
	AND wlmember.app_ref = @app_ref
	AND wlmember.person_no = @person_no