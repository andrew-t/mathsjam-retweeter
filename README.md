# mathsjam-retweeter
A tiny script to follow a list of users and retweet them

[MathsJam](http://www.mathsjam.com) started small and got either successful or out of hand depending who you ask. Eventually it was decided that giving everyone the password for the same Twitter account was a bad plan, so we switched to having separate accounts for each local chapter and a central one which retweeted them.

Unable to find a free retweeting service that wouldn't spam the followers, we built this. It will happily run on a Pi. Its job is to get a list of users from Twitter's list system, and retweet everything that they say. Note: **the retweeting account must follow the accounts on the list**. (This is because I used Twitter's streaming API which does not support lists.)

## Setup

1. Edit `index.js` with the name of the user and list to be retweeted.
2. `npm install`
3. Create a `creds.json` file with some Twitter credentials. The easiest way to get them is to register a new app and authorise it from that page rather than via the API.

```
{
	"consumer_key": "abcdef",
	"consumer_secret": "abcdef",
	"access_token": "1234-abcdef",
	"access_token_secret": "abcdef"
}
```

Then just run `node index.js`. Though I personally use:

```
npm install -g forever
forever index.js
```

It will log errors in detail and any tweets it sees/retweets as single lines.
