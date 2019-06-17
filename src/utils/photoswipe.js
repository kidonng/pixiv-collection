import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'
import image from './image'

export default (illust, el, index) =>
  new PhotoSwipe(
    el,
    PhotoSwipeUI,
    illust.metadata
      ? illust.metadata.pages.map(page => ({
          src: image(page.image_urls.large).original,
          msrc: image(page.image_urls.large).small,
          h: page.height,
          w: page.width
        }))
      : [
          {
            src: image(illust.image_urls.large).original,
            msrc: image(illust.image_urls.large).small,
            h: illust.height,
            w: illust.width
          }
        ],
    {
      galleryUID: illust.id,
      index,
      barsSize: { top: 0, bottom: 0 },
      captionEl: false,
      shareEl: false
    }
  ).init()
