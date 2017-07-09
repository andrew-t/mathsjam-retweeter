var Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	users = {};

/*
// Work out which Tuesday it is...
var now = new Date(),
	nthLastTuesday = 0,
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
*/
setTimeout(function() {
	console.log('hour passed');
	process.exit(0);
}, 1000*60*65);
// First, get a list of MathsJam accounts.
getMembers();
function getMembers(cursor) {
	var opts = {
		slug: 'monthly-mathsjams',
		owner_screen_name: 'MathsJam',
		count: 1000
	};
	// The cursor is for pagination but
	// surely that will never happen?
	if (cursor) opts.cursor = cursor;
	// This "opts" object lets us query the Twitter API
	// to get the list of members:
	twitter.get('lists/members', opts, function(err, data, response) {
		if (err) {
			console.dir(err, { colors: true });
			throw new Error('Error');
		}
		// Save the list of users here:
		data.users.forEach(function(user) {
			console.log('Following @' + user.screen_name);
			users[user.screen_name] = true;
		});
		if (data.cursor)
			// This means we have pagination to do
			// which will probably never happen.
			getMembers(cursor);
		else
			// Otherwise, move onto actually retweeting.
			done();	
	});
}

function done() {
	// Listen to the MathsJam account's timeline
	// (because list timelines don't support streaming):
	twitter.stream('user', {
		with: 'followings'
	}).on('tweet', function (tweet) {
		// Check if the user is on our list...
		if (users[tweet.user.screen_name]) {
			// ...and retweet it if so.
			console.log('Retweeting @' + tweet.user.screen_name);
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
}
