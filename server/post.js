var Post = {};
var pgPool = require('./pgPool');

Post.findAll = function(callback) {
	pgPool.connect(function(err, client, done) {
		if (err) {
			done();
			return callback(err, null);
		}

		client.query("SELECT * FROM posts", function(err, result) {
			done();

			if (err) {
				return callback(err, null);
			}

			return callback(null, result.rows);
		});
	});
};

module.exports = Post;