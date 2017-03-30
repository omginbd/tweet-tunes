var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
require('dotenv').config()

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index');
});

/* GET Tweets */
router.get('/tweets', function (req, res, next) {

    client.get('search/tweets', {q: req.query.query, filter: 'safe'}, function (err, tweets, response) {
        if (err) return console.error(err);
        res.json(tweets);
    });
});

/* EMBED Tweet */
router.get('/tweets/embed', function (req, res, next) {

    client.get('statuses/oembed', {id: req.query.tweetId}, function (err, embedded_tweet, response) {
        if (err) return console.error(err);
        res.json(embedded_tweet);
    });
});

/* Persist Tweet Tune */


/* History */


module.exports = router;
