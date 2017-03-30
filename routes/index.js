var express = require('express')
var router = express.Router()
var Twitter = require('twitter')
require('dotenv').config()

const Tweet = require('../models/tweets.js')

const toneMap = {}

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index')
});

/* GET Tweets */
router.get('/tweets', function (req, res, next) {

  client.get('search/tweets', {q: req.query.query, filter: 'safe', lang: 'en'}, function (err, tweets, response) {
    if (err) return console.error(err)
    const tweet = randomElement(tweets.statuses)
      if (!tweet.text) {
          tweet.text = "Donald Trump is the President";
      }
    const tune = makeTune(tweet.text)
    saveTune(tune, tweet)
    res.json({
      tweet,
      tune
    })
  })
})

/* EMBED Tweet */
router.get('/tweets/embed', function (req, res, next) {

  client.get('statuses/oembed', {id: req.query.tweetId}, function (err, embedded_tweet, response) {
    if (err) return console.error(err)
    res.json(embedded_tweet)
  })
})

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function makeTune(string) {
  var words = string.split(' ')
  var newTune = []

  var noteLengths = [.125, .25, .5, .75, 1]

  for (var word of words) { // Words
    var tone
    if (!toneMap[word]) {
      toneMap[word] = 220 + Math.floor(Math.random() * 800)
    }
    tone = toneMap[word]
    var newNote = {
      noteLength: randomElement(noteLengths),
      tone
    }
    newTune.push(newNote)
  }
  return newTune
}


/* Persist Tweet Tune */

function saveTune(tune, tweet) {
  const newTweet = new Tweet
  newTweet.tune = tune
  newTweet.tweet = tweet
  newTweet.save()
}

/* History */

router.get('/tunes', (req, res) => {
  try {
    Tweet.find({}, (err, tunes) => {
      if (err) return console.error(err)
      res.json(tunes)
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.get('/tunes/:id', (req, res) => {
  const id = req.params.id
  try {
    Tweet.find({_id: id}).sort({_id: -1}).all( (err, tunes) => {
      if (err) {
        console.error(err)
        res.sendStatus(500)
        return
      }
      if (tunes.length > 0) res.json(tunes.length === 1 ? tunes[0] : tunes)
      res.json(tunes.length === 1 ? tunes[0] : tunes)
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

module.exports = router
