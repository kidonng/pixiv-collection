import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'
import image from './image'

const init = (items, el, galleryUID, index) =>
  new PhotoSwipe(el, PhotoSwipeUI, items, {
    galleryUID,
    index,
    barsSize: { top: 0, bottom: 0 },
    captionEl: false,
    shareEl: false
  }).init()

export default (illust, el, index) => {
  if (illust.metadata) {
    let items = []

    illust.metadata.pages.forEach(page => {
      items.push({
        src: image(page.image_urls.large).original,
        msrc: image(page.image_urls.large).small,
        h: page.height,
        w: page.width
      })

      if (items.length === illust.metadata.pages.length)
        init(items, el, illust.id, index)
    })
  } else
    init(
      [
        {
          src: image(illust.image_urls.large).original,
          msrc: image(illust.image_urls.large).small,
          h: illust.height,
          w: illust.width
        }
      ],
      el,
      illust.id
    )
}
