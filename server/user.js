var User = {};
var pgPool = require('./pgPool');

User.find = function(username, password, callback) {
	pgPool.connect(function(err, client, done) {
		if (err) {
			done();
			return callback(null);
		}

		client.query("SELECT * FROM users where username = ($1) and password = ($2)", [username, password], function(err, result) {
			done();

			if (err) {
				return callback(null);
			}

			if (result.rows.length > 0)
				return callback(result.rows[0]);

			return callback(null);
		});
	});
};

module.exports = User;
