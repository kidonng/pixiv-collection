module.exports = async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
  res.end(
    JSON.stringify(
      await require('probe-image-size')(
        new URLSearchParams(req.url.substring(2)).get('url')
      )
    )
  )
}
