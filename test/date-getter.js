const get = require('../src/date-getter');

describe('jam data getter', () => {
	it('should get the dates', () => get()
		.then(data => {
			console.log(data);
		}));
});
