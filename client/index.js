'use strict'

var toneMap = {}
var ctx = null

function waitForReady(cb) {
  if (['complete', 'interactive'].indexOf(document.readState >= 0)) return cb()
  document.addEventListener('DOMContentLoaded', cb)
}

function playAudio(inputString) {
  // var inputString = '@CNN is in a total meltdown with their FAKE NEWS because their ratings are tanking since election and their credibility will soon be gone!'
  var words = inputString.split(' ')
  if (ctx === null) ctx = new (window.AudioContext || window.webkitAudioContext())()
  var startTime = ctx.currentTime
  var noteLengths = [.125, .25, .5, .75, 1]
  for (var i = 0; i < words.length; ++i) {
    var word = words[i]
    var noteLength = randomElement(noteLengths)
    var osc = ctx.createOscillator()
    osc.connect(ctx.destination)
    osc.type = 'sine'
    if (!toneMap[word]) toneMap[word] = 220 + Math.floor(Math.random() * 800)
    osc.frequency.value = toneMap[word]
    osc.start(startTime)
    osc.stop(startTime + noteLength)
    startTime += noteLength
  }
}

function play(inp) {
  if (!inp.trim()) return
  var tweet
  axios.get('/search/' + inp.trim())
    .then(resp => tweet = randomElement(resp.data.statuses))
    .then(() => axios.get('/fetch/' + tweet.id_str))
    .then(resp => {
      document.getElementById('tweets').innerHTML = resp.data.html
      if (window.twttr) twttr.widgets.load()
      playAudio(tweet.text)
    })
    .catch(err => {
      console.error(err)
      alert('Could not get tweet')
    })
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

waitForReady(() => {
  var input = document.getElementById('keyword-input')
  var playButton = document.getElementById('play-button')
  input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) play(input.value.trim())
  })
  playButton.addEventListener('click', () => play(input.value))
});
