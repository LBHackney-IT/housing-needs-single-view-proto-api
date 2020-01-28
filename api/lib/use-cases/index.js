module.exports = options => {
  return {
    cleanRecord: require('./CleanRecord')(options),
    groupSearchRecords: require('./GroupSearchRecords')(options),
    searchCustomers: require('./SearchCustomers')(options)
  };
};
