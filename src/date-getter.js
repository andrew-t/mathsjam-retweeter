const fetch = require('isomorphic-fetch'),
	csv = require('CSV-JS');

module.exports = function getDates() {
	const hash = {};
	return fetch('https://mathsjam.com/dates')
		.then(response => response.text())
		.then(body => {
			body.split('\n')
				.filter(row => row && !/^city,/.test(row))
				.forEach(row => {
					// console.log(row)
					const line = [];
					let str,
						lastWasQuote = false,
						inString = false;
					(row + ',').split('').forEach(c => {
						switch(c) {
							case '"':
								if (!inString) {
									str = '';
									inString = true;
									lastWasQuote = false;
								} else if (lastWasQuote) {
									str += '"';
									lastWasQuote = false;
								} else {
									lastWasQuote = true;
									inString = false;
								}
								break;
							case ',':
								if (!inString || lastWasQuote) {
									line.push(str);
									break;
								}
							default:
								str += c;
						}
					});
					// console.log(line)
					const data = {
						name: line[0],
						handle: line[1],
						date: new Date(line[2])
					};
					console.log('Retweeting @' + data.handle
						+ ' around ' + data.date);
					hash[data.handle.toLowerCase()] = data;
				});
			return hash;
		});
}
