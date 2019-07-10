const got = require('got')
const probe = require('probe-image-size')

module.exports = async (req, res) => {
  if (req.query.id)
    try {
      const body = (await got(
        `https://api.imjad.cn/pixiv/v2/${req.url.substring(
          req.url.indexOf('?')
        )}`
      )).body
      // Use image proxy
      const parsed = JSON.parse(body.replace(/i\.pximg\.net/g, 'i.pixiv.cat'))

      // Add small size avatar
      if (parsed.illust || parsed.user) {
        const target = parsed.illust || parsed
        target.user.profile_image_urls.small = target.user.profile_image_urls.medium.replace(
          '_170',
          '_50'
        )
      }

      if (parsed.illust) {
        const illusts = parsed.illust.meta_pages.length
          ? [parsed.illust, ...parsed.illust.meta_pages]
          : [parsed.illust]

        // Add small size image & thumbnail
        illusts.forEach(async illust => {
          illust.image_urls.small = illust.image_urls.medium.replace(
            '540x540_70',
            '150x150'
          )
          illust.image_urls.thumb = illust.image_urls.square_medium.replace(
            '540x540_10_webp',
            '250x250_80_a2'
          )

          // Add image height & width
          if (!illust.height) {
            const img = await probe(illust.image_urls.original)

            illust.height = img.height
            illust.width = img.width
          }

          if (illusts.every(illust => illust.height)) res.json(parsed)
        })
      } else res.json(parsed)
    } catch (e) {
      res.status(500)
      res.json({ error: JSON.stringify(e) })
    }
  else {
    res.status(400)
    res.json({ error: 'PARAMETER_NOT_FOUND' })
  }
}
