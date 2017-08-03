// gets all the data from the website data files

const fs = require('fs'),
	yaml = require('js-yaml'),
	ordinals = {
		first: 0,
		second: 1,
		third: 2,
		fourth: 3,
		fifth: 4 // this only happens every 823 years
	},
	days = {
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6,
		sunday: 0
	};

const data = { jams: [] };

const path = __dirname + '/site/cities';
fs.readdirSync(path).forEach(fn => {
	const raw = fs.readFileSync(path + '/' + fn).toString(),
		valid = `\n${raw}\n`.split('\n---\n')[1],
		parsed = yaml.safeLoad(valid, { filename: fn });
	parsed.jam_date_rule = parseRule(parsed);
	data.jams.push(parsed);
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// this is a bit hacky but seems to work:
function parseRule({
		jam_name,
		jam_date_rule = 'second-last Tuesday'
	}) {
	// some people do not do the bullshit american phrasing
	// more power to them but just for ease let's make them all the same
	jam_date_rule = jam_date_rule.replace('-to-last', '-last');
	// and again, this is nonsense in english but easier to parse:
	jam_date_rule = jam_date_rule.replace(/^last /, 'first-last ');
	const parts = jam_date_rule.toLowerCase().split(' '),
		parts2 = parts[0].split('-'),
		output = {
			which: ordinals[parts2[0]],
			day: days[parts[1]]
		};
	if (output.which == undefined) {
		console.log(`${jam_name} happens on a bullshit date (${parts2[0]})`);
		return null;
	}
	if (!output.day) {
		console.log(`${jam_name} happens on a bullshit day (${parts[1]})`);
		return null;
	}
	switch (parts2[1]) {
		case 'last': output.last = true; break;
		case undefined: output.last = false; break;
		default:
			console.log(`wtf is "${parts[0]}", ${jam_name}???`);
			return null;
	}
	return output;
}
