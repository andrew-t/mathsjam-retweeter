const Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	users = {};

function getMembers(cursor) {
	var opts = {
		slug: 'monthly-mathsjams',
		owner_screen_name: 'MathsJam',
		count: 1000
	};
	if (cursor) opts.cursor = cursor;
	twitter.get('lists/members', opts, function(err, data, response) {
		if (err) {
			console.dir(err, { colors: true });
			throw new Error('Error');
		}
		data.users.forEach(function(user) {
			console.log('Following @' + user.screen_name);
			users[user.screen_name] = true;
		});
		if (data.cursor)
			getMembers(cursor);
		else
			done();	
	});
}

getMembers();

function done() {
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
}
