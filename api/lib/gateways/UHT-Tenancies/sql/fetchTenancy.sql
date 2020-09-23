SELECT
  t.tag_ref,
  t.cot,
  t.eot,
  t.u_rent_patch as ic_patch,
  t.tenure,
  t.u_saff_rentacc,
  p.address1,
  p.post_code,
  p.u_llpg_ref as uprn
FROM
  tenagree AS t
  JOIN property AS p ON p.prop_ref = t.prop_ref
WHERE tag_ref = @tag_ref