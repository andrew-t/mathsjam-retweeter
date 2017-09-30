const fetch = require('isomorphic-fetch');

module.exports = () =>
	fetch('http://mathsjam.com/dates')
		.then(response => response.text())
		.then(body => body
			// Commas in place names aren't escaped but this gets them:
			.replace(/, /g, ' ')
			.split('\n')
			// Trim (trailing) blank lines and first header line
			.filter((line, i) => line && i)
			.map(line => {
				const [ name, handle, date ] =
					line.split(',');
				return {
					name,
					handle,
					date: new Date(date)
				};
			}))
		.then(array => {
			const hash = {};
			array.forEach(jam => hash[jam.handle] = jam);
			return hash;
		});
