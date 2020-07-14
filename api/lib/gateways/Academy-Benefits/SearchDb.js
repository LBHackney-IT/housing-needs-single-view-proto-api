const path = require('path');
const { loadSQL } = require('../../Utils');
const { searchCustomersSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const search = async (queryParams) => {
    let whereClause = [];
    let params = [];
    if (queryParams.firstName && queryParams.firstName !== '') {
      params.push({
        id: 'forename',
        type: 'NVarChar',
        value: `%${queryParams.firstName.toUpperCase().trim()}%`
      });
      whereClause.push('forename LIKE @forename');
    }
    if (queryParams.lastName && queryParams.lastName !== '') {
      params.push({
        id: 'surname',
        type: 'NVarChar',
        value: `%${queryParams.lastName.toUpperCase().trim()}%`
      });
      whereClause.push('surname LIKE @surname');
    }
  
    whereClause = whereClause.map(clause => `(${clause})`);
    const query = `${searchCustomersSQL} AND(${whereClause.join(' AND ')})`;
    return await db.request(query, params);
  };

  return {
    searchDb: search
  }
};