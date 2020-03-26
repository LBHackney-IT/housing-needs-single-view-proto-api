const { formatRecordDate } = require('../Utils');

module.exports = () => {
  return ({ userid, id, title, text, date, user, system, format }) => {
    return {
      userid,
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
