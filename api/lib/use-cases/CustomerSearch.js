module.exports = options => {
  const cleanRecord = options.cleanRecord;
  const gateways = options.gateways;
  const groupSearchRecords = options.groupSearchRecords;

  return async query => {
    const requests = gateways.map(async gateway => gateway.execute(query));
    const records = [].concat.apply([], await Promise.all(requests));
    return groupSearchRecords(records.map(cleanRecord));
  };
};
