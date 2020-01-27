module.exports = options => {
  const badData = options.badData;

  return record => {
    if (record.dob && badData.dob.includes(record.dob)) {
      record.dob = null;
    }
    if (!record.address) {
      return record;
    }
    if (typeof record.address === 'string') {
      if (record.address && badData.address.includes(record.address)) {
        record.address = null;
      }
    } else if (typeof record.address.length !== 'undefined') {
      record.address = record.address.filter(a => {
        return (
          a.address.length > 0 &&
          !badData.address.includes(a.address.join(', '))
        );
      });
    }
    return record;
  };
};
