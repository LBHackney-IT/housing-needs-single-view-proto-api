const path = require('path');
const { loadSQL } = require('../Utils');
const { searchCustomersBaseSQL } = loadSQL(path.join(__dirname, '../sql/AcademyBenefits'));

module.exports = options => {
    const db = options.db

    return {
        execute: queryParams => {
            let whereClause = [];
            let params = [];

            if(queryParams.firstName && queryParams.firstName !== '') {
                params.push({
                    id: 'forename',
                    type: 'NVarChar',
                    value: `%${queryParams.firstName.toUpperCase()}%`
                });

                whereClause.push('forename LIKE @forename');
            }

            const query = `${searchCustomersBaseSQL} AND(${whereClause.join(' AND ')})`;

            db.request(query, params)
        }
    }
}
