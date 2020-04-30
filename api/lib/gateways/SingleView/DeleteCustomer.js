module.exports = options => {
  const db = options.db;
  const Logger = options.Logger;

  return {
    execute: async id => {
      try {
        const removeLinksQuery =
          'DELETE FROM customer_links WHERE customer_id = ${id}';
        const removeCustomerQuery = 'DELETE FROM customers WHERE id = ${id}';

        await db.none(removeLinksQuery, { id });
        return await db.none(removeCustomerQuery, { id });
      } catch (err) {
        Logger.error(
          `Could not add a disconnect customer because of an error: ${err}`,
          err
        );
      }
    }
  };
};
