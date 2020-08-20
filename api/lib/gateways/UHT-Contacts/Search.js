const moment = require('moment');

module.exports = options => {
  const searchDb = options.searchDb;
  const searchApi = options.searchApi;
  const logger = options.logger;

  const checkRecordsAreIdentical = (dbRecords, apiRecords) => {
    if (sameResults(dbRecords, apiRecords)) {
      logger.log(
        'UHT Contact records retrieved from the API and the DB are identical'
      );
    } else {
      logger.log('Housing API and UH DB have returned different records');
      logger.log({ 'DB records': dbRecords });
      logger.log({ 'API records': apiRecords });
    }
  };

  const sameResults = (dbRecords, apiRecords) => {
    if (dbRecords.length !== apiRecords.length) return false;
    let equal = true;
    for (const record of dbRecords) {
      if (!apiRecords.find(r => recordEquality(record, r))) {
        equal = false;
        break;
      }
    }
    return equal;
  };

  const recordEquality = (record1, record2) => {
    return (
      record1.id === record2.id &&
      record1.links.uhContact === record2.links.uhContact &&
      stringDataEquality(record1.firstName, record2.firstName) &&
      stringDataEquality(record1.lastName, record2.lastName) &&
      stringDataEquality(record1.nino, record2.nino) &&
      stringDataEquality(record1.postcode, record2.postcode) &&
      (record1.dob === record2.dob ||
        moment(record1.dob).diff(moment(record2.dob), 'days') < 1)
    );
  };

  const stringDataEquality = (string1, string2) => {
    if (string1 == string2) return true;
    if (!string1 || !string2) return false;
    return string1.toLowerCase().trim() === string2.toLowerCase().trim();
  };

  return {
    execute: async queryParams => {
      let dbRecords;
      try {
        dbRecords = await searchDb.execute(queryParams);
      } catch (err) {
        console.log(err);
        logger.error(`Error searching customers in UHT-Contacts: ${err}`, err);
        return [];
      }
      const apiRecords = await searchApi.execute(queryParams);
      checkRecordsAreIdentical(dbRecords, apiRecords);
      return dbRecords;
    }
  };
};
