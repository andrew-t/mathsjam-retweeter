var Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	fs = require('fs'),
	cp = require('child_process'),
	users = {},
	oneDay = 24 * 60 * 60 * 1000;

function getData() {
	var raw = JSON.parse(fs.readFileSync('data.json')),
		newUsers;
	for (var jam of raw.jams)
		// todo - hiatus_months
		if (!jam.hiatus && jam.twitter)
			newUsers[jam.twitter] = jam.jam_date_rule;
	users = newUsers;
}

getData();
setInterval(function() {
	cp.exec('./update-git.sh', getData);
});

twitter.stream('user', {
	with: 'followings'
}).on('tweet', function (tweet) {
	var jam = users[tweet.user.screen_name];
	if (!jam) {
		// console.log('Not retweeting ' + tweet.user.screen_name);
		return;
	}

	var now = Date.now(),
		todayI = now - (now % oneDay),
		todayD = new Date(todayI),
		year = todayD.getUTCFullYear(),
		month = todayD.getUTCMonth(),
		jams = [-1, 0, 1].map(function(s) {
			return new Date(year,
				month + s,
				jamDate(jam, year, month + s));
		});
	if (!jams.any(function(jam) {
			return Math.abs(todayI - jam) < oneDay * 1.5;
		})) {
		// console.log('Not retweeting ' + tweet.user.screen_name + ' today');
		return;
	}

	// console.log('Retweeting ' + tweet.user.screen_name);
	twitter.post(
		'/statuses/retweet/' + tweet.id_str,
		{},
		function (err, data, response) {
			if (err)
				console.log(err);
		});
});

function jamDate(rule, year, month) {
	// the 0th of the month is the last day of the previous month
	// and js is pretty happy to accept dates like 2017/14/-5
	// and roll them round as needed so let's use that madness
	var lengthOfMonth = new Date(year, month + 1, 0),
		candidates = [];
	for (var i = 1; i <= lengthOfMonth; ++i)
		candidates.push(i);
	if (rule.last)
		candidates.reverse();
	// todo - this is super lazy but whatevs
	return candidates
		.filter(function(c) {
			return new Date(year, month, c).getDay() == rule.day
		})[rule.which];
}
