SELECT
  member.title,
  member.forename,
  member.surname,
  member.dob
FROM
  member
  JOIN tenagree ON tenagree.house_ref = member.house_ref
WHERE tag_ref = @tag_ref