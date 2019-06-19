const querystring = require('querystring')
const got = require('got')

module.exports = async (req, res) => {
  const query = querystring.parse(req.url.substring(req.url.indexOf('?') + 1))
  const reply = data => res.end(JSON.stringify(data))

  if (query.id)
    try {
      let body = (await got(
        `https://api.imjad.cn/pixiv/v2/${req.url.substring(
          req.url.indexOf('?')
        )}`
      )).body

      body = body.replace(/i\.pximg\.net/g, 'i.pixiv.cat')

      res.end(body)
    } catch (e) {
      res.writeHead(500)
      reply({ error: JSON.stringify(e) })
    }
  else {
    res.writeHead(400)
    reply({ error: 'PARAMETER_NOT_FOUND' })
  }
}
