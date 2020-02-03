const { formatRecordDate } = require('@lib/Utils');

module.exports = () => {
  return ({ title, text, date, user, system }) => {
    return {
      title,
      text,
      date: formatRecordDate(date),
      user,
      system
    };
  };
};
