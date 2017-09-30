const TweetHandler = require('./tweet-handler'),
	getDates = require('./date-getter'),
	Twit = require('twit'),
	config = require('../config.json');

getDates()
	.then(jams => new TweetHandler(
		new Twit(require('../creds.json')),
		jams,
		() => new Date()))
	.catch(error => {
		console.log(error);
		process.exit(1);
	});

setTimeout(() => {
	console.log('Shutting down for the night.');
	process.exit(0);
}, config * 3600000);
