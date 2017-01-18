var toneMap = {}

function waitForReady(cb) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    cb()
  }

  document.addEventListener('DOMContentLoaded', function() {
    cb()
  })
}

function playAudio(inputString) {
  // var input = (`@CNN is in a total meltdown with their FAKE NEWS because their ratings are tanking since election and their credibility will soon be gone!`).split(' ')
  var words = inputString.split(' ')
  var ctx = new (window.AudioContext || window.webkitAudioContext())()
  var startTime = ctx.currentTime
  for (var word of words) { // Words
    console.log(startTime)
    var noteLength = .25
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

waitForReady(function() {
  var input = document.getElementById('keyword-input')
  var playButton = document.getElementById('play-button')
  playButton.addEventListener('click', function() {
    playAudio(input.value)
  })
})
