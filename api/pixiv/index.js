const querystring = require('querystring')
const got = require('got')

module.exports = async (req, res) => {
  const query = querystring.parse(req.url.substring(req.url.indexOf('?') + 1))
  const reply = data => res.end(JSON.stringify(data))

  if (query.id)
    try {
      const parsed = JSON.parse(
        (await got(
          `https://api.imjad.cn/pixiv/v2/${req.url.substring(
            req.url.indexOf('?')
          )}`
        )).body.replace(/i\.pximg\.net/g, 'i.pixiv.cat')
      )

      if (parsed.illust) {
        const illusts = parsed.illust.meta_pages.length
          ? [parsed.illust, ...parsed.illust.meta_pages]
          : [parsed.illust]

        illusts.forEach(illust => {
          illust.image_urls.small = illust.image_urls.medium.replace(
            '540x540_70',
            '150x150'
          )
          illust.image_urls.thumb = illust.image_urls.square_medium.replace(
            '540x540_10_webp',
            '250x250_80_a2'
          )
        })
      }

      if (parsed.illust || parsed.user)
        (
          parsed.illust || parsed
        ).user.profile_image_urls.small = parsed.illust.user.profile_image_urls.medium.replace(
          '_170',
          '_50'
        )

      reply(parsed)
    } catch (e) {
      res.writeHead(500)
      reply({ error: JSON.stringify(e) })
    }
  else {
    res.writeHead(400)
    reply({ error: 'PARAMETER_NOT_FOUND' })
  }
}
