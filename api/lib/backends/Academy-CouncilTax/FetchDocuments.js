const Comino = require('../Comino');

module.exports = () => {
  return async account_ref => {
    try {
      return await Comino.fetchCustomerDocuments({ account_ref });
    } catch (err) {
      console.log(`Error fetching customer notes in Comino: ${err}`);
    }
  };
};
