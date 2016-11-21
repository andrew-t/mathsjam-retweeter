const Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	users = {};

twitter.get('lists/members', {
	slug: 'monthly-mathsjams',
	owner_screen_name: 'MathsJam'
}, function (err, data, response) {
	console.log(data);
	// TODO - store users
	// users[username] = true;
});

twitter.stream('user', {
	with: 'followings'
}).on('tweet', function (tweet) {
	if (users[tweet.user.screen_name])
		twitter.post(
			'/statuses/retweet/' + tweet.id_str,
			{},
			function (err, data, response) {
				if (err)
					console.log(err);
			});
});
