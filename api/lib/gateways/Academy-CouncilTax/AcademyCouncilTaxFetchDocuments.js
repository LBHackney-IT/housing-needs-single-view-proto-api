module.exports = options => {
  Comino = options.Comino;

  return {
    execute: async account_ref => {
      return await Comino.fetchCustomerDocuments({ account_ref });
    }
  };
};
