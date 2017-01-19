var toneMap = {}
var ctx = null;

function waitForReady(cb) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        cb()
    }

    document.addEventListener('DOMContentLoaded', function () {
        cb()
    })
}

function playAudio(inputString) {
    // var input = (`@CNN is in a total meltdown with their FAKE NEWS because their ratings are tanking since election and their credibility will soon be gone!`).split(' ')
    var words = inputString.split(' ')
    if (ctx === null) {
        ctx = new (window.AudioContext || window.webkitAudioContext())();
    }

    var startTime = ctx.currentTime
    var noteLengths = [.125, .25, .5, .75, 1];
    for (var word of words) { // Words
        console.log(startTime)
        var noteLength = noteLengths[Math.floor(Math.random() * noteLengths.length)];
        var osc = ctx.createOscillator()
        osc.connect(ctx.destination)
        osc.type = 'sine'
        if (!toneMap[word]) {
            toneMap[word] = Math.floor(Math.random() * 5000)
        }
        osc.frequency.value = toneMap[word]
        osc.start(startTime)
        osc.stop(startTime + noteLength)
        startTime += noteLength
        console.log('now playing ' + word + ' ' + toneMap[word])
    }
}

function retrieveTweets(inputString) {
    $.ajax({
        url: 'http://localhost:63342/tweet-tunes/getTweets.php',
        type: 'GET',
        dataType: 'json',
        data: {
            query: inputString
        },
        success: function (response) {
            console.log(response);
            var tweet = selectTweet(response.statuses);
            console.log(tweet);
            displayTweet(tweet);
            playAudio(tweet.text);
        },
        error: function (response) {
            alert("Could not get tweets");
        }
    });
}

function selectTweet(tweets) {
    return tweets[0];
}

function displayTweet(tweet) {
    console.log(tweet);
    $('.tweets').append('<p>' + tweet.text + '</p>');
}

waitForReady(function () {
    var input = document.getElementById('keyword-input')
    var playButton = document.getElementById('play-button')
    playButton.addEventListener('click', function () {
        retrieveTweets(input.value);
    })
});
