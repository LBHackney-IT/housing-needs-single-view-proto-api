const {
  checkString,
  nameCase,
  formatAddress,
  formatDisplayDate,
  upperCase
} = require('../Utils');

module.exports = ({
  id,
  firstName,
  lastName,
  dob,
  nino,
  addr1,
  addr2,
  addr3,
  addr4,
  postcode,
  source,
  links
}) => {
  return {
    id,
    firstName: nameCase(firstName),
    lastName: nameCase(lastName),
    dob: dob ? formatDisplayDate(dob) : null,
    nino: upperCase(nino),
    address: formatAddress([addr1, addr2, addr3, addr4, postcode]).join(', '),
    postcode: checkString(postcode),
    source,
    links
  };
};
