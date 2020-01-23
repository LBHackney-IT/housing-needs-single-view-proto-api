const url = require('url');

const pgp = require('pg-promise')({
  // global db error handler
  error(err, e) {
    console.log(`Postgres Error:
    Query: "${e && e.query ? e.query.replace('\n', '') : ''}"
    Error: "${err ? err.message : ''}"`);
  }
});

const dbUrl = url.parse(process.env.SINGLEVIEW_DB);
const [user, password] = dbUrl.auth.split(':');

const PostgresDb = pgp({
  host: dbUrl.host.split(':')[0],
  port: dbUrl.port,
  database: dbUrl.path.replace('/', ''),
  user,
  password
});

module.exports = PostgresDb;
