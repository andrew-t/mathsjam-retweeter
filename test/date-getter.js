const get = require('../src/date-getter');

describe('jam data getter', function () {
	this.timeout(5000);
	it('should get the dates', () => {
		return get()
			.then(data => {
				console.log('returned')
				console.log(data);
			}, err => {
				console.error('err', err.stack);
				throw err;
			});
	});
});
