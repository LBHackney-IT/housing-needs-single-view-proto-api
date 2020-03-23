const { formatRecordDate } = require('../Utils');

module.exports = () => {
  return ({ id, title, text, date, user, system }) => {
    return {
      id,
      title,
      text,
      date: formatRecordDate(date),
      user,
      system,
      format
    };
  };
};
