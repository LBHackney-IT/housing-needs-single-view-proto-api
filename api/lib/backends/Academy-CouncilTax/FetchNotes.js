const Comino = require('@lib/backends/Comino');

module.exports = () => {
  return async account_ref => {
    try {
      return await Comino.fetchCustomerNotes({ account_ref });
    } catch (err) {
      console.log(`Error fetching customer notes in Comino: ${err}`);
    }
  };
};
