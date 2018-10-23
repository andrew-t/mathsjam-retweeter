module.exports.promisify = function p(c) {
	return (...a) => new Promise((resolve, reject) => {
		p(...a, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

