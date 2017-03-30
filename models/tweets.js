var mongoose = require('mongoose')

var TweetSchema = new mongoose.Schema({
  tune: [mongoose.Schema.Types.Mixed],
  tweet: mongoose.Schema.Types.Mixed
})

var Tweet = mongoose.model('Tweet', TweetSchema)

module.exports = Tweet
