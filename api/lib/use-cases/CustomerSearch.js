module.exports = options => {
  const gateways = options.gateways;
  const groupRecords = options.groupRecords;
  const validateRecords = options.validateRecords;

  return async query => {
    const requests = gateways.map(async gateway => gateway.execute(query));
    const records = [].concat.apply([], await Promise.all(requests));

    const validatedRecords = validateRecords(records);
    return groupRecords(validatedRecords);
  };
};
