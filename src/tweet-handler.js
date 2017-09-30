const config = require('../config.json'),
	h2ms = 3600000;

module.exports = class TweetHandler {
	constructor(twit, jams, now) {
		this.now = now;
		this.jams = jams;
		this.twit = twit;

		this.twit.stream('user', {
			with: 'followings'
		}).on('tweet', tweet => {
			const jam = jams[tweet.user.screen_name];
			if (!jam)
				return;
			const timeOffset = this.now() - jam.date;
			if (timeOffset > config.after * h2ms)
				return;
			if (timeOffset < -config.before * h2ms)
				return;
			console.log('Retweeting ' + jam.name);
			this.twit.post(
				'/statuses/retweet/' + tweet.id_str,
				{},
				(err, data, res) => {
					if (err)
						console.log(err);
				});
		});
	}
};
