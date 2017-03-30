var ctx = null
var tweet = null
var tune = null
var tuneMap = {}

function waitForReady(cb) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        cb()
    }

    document.addEventListener('DOMContentLoaded', function () {
        cb()
    })
}

function playAudio(tune) {
    if (ctx === null) {
        ctx = new (window.AudioContext || window.webkitAudioContext())()
    }
    var startTime = ctx.currentTime
    for (var note of tune) {
        var noteLength = note.noteLength
        var osc = ctx.createOscillator()
        osc.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = note.tone
        osc.start(startTime)
        osc.stop(startTime + noteLength)
        startTime += noteLength
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
            tweet = response.tweet
            tune = response.tune
            embedTweet(tweet)
        },
        error: function (response) {
            alert("Could not get tweets")
        }
    })
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
            displayTweet(response.html)
            var tweetVisible = false
            do {
                var pageTweet = document.getElementsByClassName('Tweet-text')
                if (pageTweet) {
                    tweetVisible = true
                }
            } while (!tweetVisible)
            playAudio(tune)
        }, error: function (response) {
            alert(response.errors[0].message)
        }
    })
}

function displayTweet(tweet) {
    $('.tweets').html(tweet)
}

waitForReady(function () {
    var input = document.getElementById('keyword-input')
    var playButton = document.getElementById('play-button')
    playButton.addEventListener('click', function () {
        retrieveTweets(input.value)
    })
})

$(document).ready(function () {
    updateHistory();
});

function updateHistory() {
    $.ajax({
        url: '/tunes',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            loadHistory(response);
        },
        error: function (response) {
            alert("Could not get tune History");
        }
    });
}

function loadHistory(tunes) {
    var html = "<ul class='list-group'>";

    tuneMap = {}

    for (var tune of tunes) {
        tuneMap[tune._id] = tune.tune
        html += "<li class='list-group-item' id=" + tune._id + ">" + tune.tweet.text + "</li>"
    }
    html += "</ul>";

    $('#tunes').html(html)

    for (var tune of tunes) {
        $('#' + tune._id).click(function () {
            playAudio(tune.tune);
        });
    }
}

