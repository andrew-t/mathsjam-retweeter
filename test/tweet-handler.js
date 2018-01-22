const assert = require('assert');

const jams = {
	realjam: {
		name: 'A Real MathsJam',
		handle: 'RealJam',
		date: new Date('2017-10-10')
	}
};

const goodTweet = {
	user: {
		screen_name: 'RealJam'
	},
	id_str: '12345'
};

let nextTweet,
	onPost,
	tweetHandlerCallback;
const fakeTwitter = {
	stream: () => ({
		on: (event, fn) => tweetHandlerCallback = fn
	}),
	post: (url, body, fn) => {
		fn(null, {}, {});
		onPost(url, body);
	}
};

let currentDate = new Date('2017-10-10 20:17:32');
const TweetHandler = require('../src/tweet-handler');
new TweetHandler(
	fakeTwitter,
	jams,
	() => currentDate);

describe('tweet handler', () => {
	it('should retweet a good tweet', done => {
		let posted = false;
		onPost = (url, body) => {
			assert(url == '/statuses/retweet/12345');
			assert(JSON.stringify(body) == '{}');
			posted = true;
		};
		tweetHandlerCallback(goodTweet);
		setTimeout(() => {
			assert(posted);
			done();
		}, 50);
	});

	it('should not retweet a stranger', done => {
		let posted = false;
		onPost = (url, body) => {
			posted = true;
		};
		tweetHandlerCallback(Object.assign({},
			goodTweet, {
				user: { screen_name: 'Jeff' }
			}));
		setTimeout(() => {
			assert(!posted);
			done();
		}, 50);
	});

	it('should not retweet a tweet before mathsjam day', done => {
		let posted = false;
		onPost = (url, body) => {
			posted = true;
		};
		currentDate = new Date('2017-10-05 15:36:12');
		tweetHandlerCallback(goodTweet);
		setTimeout(() => {
			assert(!posted);
			done();
		}, 50);
	});

	it('should not retweet a tweet after mathsjam day', done => {
		let posted = false;
		onPost = (url, body) => {
			posted = true;
		};
		currentDate = new Date('2017-10-15 15:36:12');
		tweetHandlerCallback(goodTweet);
		setTimeout(() => {
			assert(!posted);
			done();
		}, 50);
	});
});
