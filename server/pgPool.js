var pg = require('pg');
var pgConfig = {
	user: 'postgres',
	database: 'saveondev',
	password: '',
	port: 5432
};
var pgPool = new pg.Pool(pgConfig);
module.exports = pgPool;