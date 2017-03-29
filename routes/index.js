var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* GET Tweets */
router.get('/tweets', function (req, res, next) {
    res.render('tweets');
});

/* EMBED Tweet */


/* Persist Tweet Tune */


/* History */


module.exports = router;
