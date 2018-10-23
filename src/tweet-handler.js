const config = require('../config.json'),
	h2ms = 3600000;
const { promisify } = require('./util');
module.exports = class TweetHandler {
	constructor(twit, jams, now) {
		this.now = now;
		this.jams = jams;
		this.twit = twit;

//		this.twit.stream('user', {
const doIt = () => {
	promisify(this.twit.get).call(this.twit,'statuses/home_timeline')
			//with: 'followings'
		//}).on('tweet', tweet => {
.then(data => {
console.log('downloadedi', data.length, 'tweets');
//console.log(data);
data.forEach(tweet => {
console.log('doing tweet', tweet.id_str);
			const jam = jams[tweet.user.screen_name.toLowerCase()];
			if (!jam) {
				console.log(`Never heard of ${tweet.user.screen_name}.`);
				return;
			}
			const timeOffset = this.now() - jam.date;
			if (timeOffset > config.after * h2ms) {
				console.log(`Too late to retweet ${jam.name}.`);
				return;
			}
			if (timeOffset < -config.before * h2ms) {
				console.log(`Too soon to retweet ${jam.name}.`);
				return;
			}
			console.log(`Retweeting ${jam.name}.`);
			this.twit.post(
				`/statuses/retweet/${tweet.id_str}`,
				{},
				(err, data, res) => {
					if (err)
						console.log(err);
				});
}); });
	}

doIt()
setInterval(doIt	, 60000);
	}
};
