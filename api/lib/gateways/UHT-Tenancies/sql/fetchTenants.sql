SELECT
  member.title,
  member.forename,
  member.surname,
  member.dob,
  member.person_no,
  member.responsible,
  contacts.con_phone1,
  contacts.con_phone2,
  contacts.con_phone3,
  contacts.email_address,
  lookup.lu_desc as relationship
FROM
  member
  JOIN tenagree ON tenagree.house_ref = member.house_ref
  JOIN contacts AS contacts ON contacts.con_ref = member.house_ref
  LEFT JOIN lookup ON member.relationship = lookup.lu_ref and lu_type='CRE'
WHERE tenagree.tag_ref = @tag_ref