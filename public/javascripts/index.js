var toneMap = {};
var ctx = null;
var tweet = null;

function waitForReady(cb) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        cb();
    }

    document.addEventListener('DOMContentLoaded', function () {
        cb();
    })
}

function playAudio(inputString) {
    // var input = (`@CNN is in a total meltdown with their FAKE NEWS because their ratings are tanking since election and their credibility will soon be gone!`).split(' ')
    var words = inputString.split(' ');
    if (ctx === null) {
        ctx = new (window.AudioContext || window.webkitAudioContext())();
    }

    var startTime = ctx.currentTime;
    var noteLengths = [.125, .25, .5, .75, 1];

    for (var word of words) { // Words
        // console.log(startTime)
        var noteLength = randomElement(noteLengths);
        var osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.type = 'sine';
        if (!toneMap[word]) {
            toneMap[word] = 220 + Math.floor(Math.random() * 800);
        }
        osc.frequency.value = toneMap[word];
        osc.start(startTime);
        osc.stop(startTime + noteLength);
        startTime += noteLength;
        // console.log('now playing ' + word + ' ' + toneMap[word])
    }
}

function retrieveTweets(inputString) {
    $.ajax({
        url: '/tweets',
        type: 'GET',
        dataType: 'json',
        data: {
            query: inputString
        },
        success: function (response) {
            tweet = selectTweet(response.statuses);
            embedTweet(tweet);
        },
        error: function (response) {
            alert("Could not get tweets");
        }
    });
}

function selectTweet(tweets) {
    return randomElement(tweets);
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function embedTweet(tweet) {
    $.ajax({
        url: '/tweets/embed',
        type: 'GET',
        dataType: 'json',
        data: {
            tweetId: tweet.id_str
        },
        success: function (response) {
            displayTweet(response.html);
            var tweetVisible = false;
            do {
                var pageTweet = document.getElementsByClassName('Tweet-text');
                if (pageTweet) {
                    console.log(pageTweet);
                    tweetVisible = true;
                }
            } while(!tweetVisible);
            playAudio(tweet.text);
        }, error: function (response) {
            alert(response.errors[0].message);
        }
    });
}

function displayTweet(tweet) {
    $('.tweets').html(tweet);
}

waitForReady(function () {
    var input = document.getElementById('keyword-input');
    var playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function () {
        retrieveTweets(input.value);
    })
});
