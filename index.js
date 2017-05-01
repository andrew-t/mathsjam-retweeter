const Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	users = {};

// Work out which Tuesday it is...
const now = new Date();
let nthLastTuesday = 0,
	now = Date.now(),
	currentMonth = now.getMonth();
do {
	now = new Date(now.getTime() + 1000*60*60*24*7);
	nthLastTuesday++;
} while (now.getMonth() == currentMonth);
// Only run on the second to last Tuesday.
if (nthLastTuesday !== 2) {
	console.log('Not running on the ' +
		nthLastTuesday + 'th-to-last Tuesday.');
	process.exit(0);
	return;
}

// The app runs for 36 hours:
// from 5AM on Tuesday morning
// to 5PM on Wednesday afternoon.
// This should be enough time for all
// global MathsJams to happen.
setTimeout(function() {
	console.log('Shutting down for the night.');
	process.exit(0);
}, 1000 * 60 * 60 * 36);

// Finally the code that actually makes things happen.
// First we fetch a list of accounts to retweet...
twitter.get('lists/members', {
	slug: 'monthly-mathsjams',
	owner_screen_name: 'MathsJam'
}, function (err, data, response) {
	
	if (err) {
		console.dir(err, { colors: true });
		return;
	}

	// ...and store that list...
	data.users.forEach(function(user) {
		users[user.screen_name] = true;
		console.log('Following @' + user.screen_name);
	});

	// ...and then we listen for incoming tweets.
	twitter.stream('user', {
		with: 'followings'
	}).on('tweet', function (tweet) {
		// If it's a user we want to retweet...
		if (users[tweet.user.screen_name]) {
			console.log('Retweeting @' + tweet.user.screen_name);
			// ...retweet it.
			twitter.post(
				'/statuses/retweet/' + tweet.id_str,
				{},
				function (err, data, response) {
					if (err)
						console.log(err);
				});
		} else 
			console.log('Ignoring @' + tweet.user.screen_name);
	});

});
