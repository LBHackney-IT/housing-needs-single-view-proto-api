const rp = require('request-promise');
const moment = require('moment');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiToken = options.apiToken;

  return {
    execute: async (paymentRef, postcode) => {
      return await rp(
        `${baseUrl}/api/v1/transactions/payment-ref/${paymentRef}/post-code/${postcode}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiToken
          },
          json: true
        }
      ).then(response => {
        return response;
      });
    },

    cleanData: data => {
      data.transactions.map(transaction => {
        transaction.date
          ? (transaction.date = moment(transaction.date).format('DD/MM/YYYY'))
          : transaction.date;
        if (transaction.in) {
          transaction.in = transaction.in.replace('(', '-');
          transaction.in = transaction.in.replace('¤', '£');
          transaction.in = transaction.in.replace(')', '');
        }

        if (transaction.out) {
          transaction.out = transaction.out.replace('(', '-');
          transaction.out = transaction.out.replace('¤', '£');
          transaction.out = transaction.out.replace(')', '');
        }

        if (transaction.balance) {
          transaction.balance = transaction.balance.replace('(', '-');
          transaction.balance = transaction.balance.replace('¤', '£');
          transaction.balance = transaction.balance.replace(')', '');
          if (transaction.balance.charAt(0) === '-') {
            transaction.balance = transaction.balance.replace('-', '');
          } else {
            transaction.balance =
              transaction.balance.slice(0, 0) +
              '-' +
              transaction.balance.slice(0);
          }
        }
      });
      return data;
    }
  };
};
