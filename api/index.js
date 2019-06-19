const querystring = require('querystring')
const probe = require('probe-image-size')

require('http')
  .createServer(async (req, res) => {
    const query = querystring.parse(req.url.substring(req.url.indexOf('?') + 1))
    const reply = data => res.end(JSON.stringify(data))

    if (query.url) {
      try {
        reply(await probe(query.url))
      } catch (e) {
        res.writeHead(500)
        reply({ error: JSON.stringify(e) })
      }
    } else {
      res.writeHead(400)
      reply({ error: 'PARAMETER_NOT_FOUND' })
    }
  })
  .listen(10000, 'localhost')
