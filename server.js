const fs = require('fs')
const http = require('http')
const Twitter = require('twit')

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  app_only_auth: true,
})

const port = process.env.PORT || 3000
http.createServer((req, res) => {
  match(req, res, {
    '/search/': search,
    '/fetch/': fetch,
    '/': serve,
  }, notFound)
}).listen(port, () => {
  console.log('Listening on port', port)
})

function serve(res, file) {
  const stream = fs.createReadStream(`${__dirname}/client/${file || 'index.html'}`)
  stream.on('error', () => notFound(res))
  stream.pipe(res)
}

function search(res, q) {
  client.get('search/tweets', { q, filter: 'safe' })
    .then(resp => res.end(JSON.stringify(resp.data)))
    .catch(handleError(res))
}

function fetch(res, id) {
  client.get('statuses/oembed', { id })
    .then(resp => res.end(JSON.stringify(resp.data)))
    .catch(handleError(res))
}

function match(req, res, routes, notFound) {
  for (const key in routes) {
    const matches = req.url.indexOf(key) === 0
    if (matches) return routes[key](res, req.url.replace(key, ''))
  }
  notFound(res)
}

const handleError = res => err => {
  console.error(err)
  res.writeHead(500)
  res.end()
}

const notFound = (res) => {
  res.writeHead(404)
  res.end('Not Found')
}
