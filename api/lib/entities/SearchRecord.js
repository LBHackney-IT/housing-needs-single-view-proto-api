const {
  checkString,
  nameCase,
  formatAddress,
  formatDisplayDate,
  upperCase
} = require('@lib/Utils');

module.exports = () => {
  return ({
    id,
    firstName,
    lastName,
    dob,
    nino,
    address,
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
      address: formatAddress(address).join(', '),
      postcode: checkString(postcode),
      source,
      links
    };
  };
};
