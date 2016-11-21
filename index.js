const Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	users = {};

twitter.get('lists/members', {
	slug: 'monthly-mathsjams',
	owner_screen_name: 'MathsJam'
}, function (err, data, response) {
	
	data.users.forEach(function(user) {
		users[user.screen_name] = true;
		console.log('Following @' + user.screen_name);
	});

	twitter.stream('user', {
		with: 'followings'
	}).on('tweet', function (tweet) {
		if (users[tweet.user.screen_name]) {
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

});
