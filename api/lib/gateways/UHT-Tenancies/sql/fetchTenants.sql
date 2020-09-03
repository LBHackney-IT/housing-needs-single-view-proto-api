SELECT
  member.title,
  member.forename,
  member.surname,
  member.dob,
  contacts.con_phone1,
  contacts.con_phone2,
  contacts.con_phone3,
  contacts.email_address
FROM
  member
  JOIN tenagree ON tenagree.house_ref = member.house_ref
  JOIN contacts AS contacts ON contacts.con_ref = member.house_ref
WHERE tenagree.tag_ref = @tag_ref