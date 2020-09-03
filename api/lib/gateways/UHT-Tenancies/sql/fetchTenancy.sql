SELECT
  t.tag_ref,
  t.cot,
  t.eot,
  t.u_rent_patch as ic_patch,
  t.tenure,
  p.address1,
  p.post_code
FROM
  tenagree AS t
  JOIN property AS p ON p.prop_ref = t.prop_ref
WHERE tag_ref = @tag_ref