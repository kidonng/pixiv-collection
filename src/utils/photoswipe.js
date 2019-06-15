import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

export default function(memberIndex, illustIndex, collection, el) {
  const items = []
  collection[memberIndex].illust.forEach(illust =>
    items.push({
      src: illust.image_urls.large,
      msrc: illust.image_urls.small,
      h: illust.height,
      w: illust.width
    })
  )

  new PhotoSwipe(el, PhotoSwipeUI, items, {
    galleryUID: memberIndex + 1,
    index: illustIndex,
    barsSize: { top: 0, bottom: 0 },
    captionEl: false,
    shareEl: false
  }).init()
}
