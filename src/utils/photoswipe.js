import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

export default (member, illustID, el) => {
  let items = []
  member.illusts.forEach(illust =>
    items.push({
      src: illust.image_urls.large,
      msrc: illust.image_urls.small,
      h: illust.height,
      w: illust.width,
      pid: illust.id
    })
  )

  new PhotoSwipe(el, PhotoSwipeUI, items, {
    galleryUID: member.id,
    galleryPIDs: true,
    index: items.findIndex(item => item.pid === illustID),
    barsSize: { top: 0, bottom: 0 },
    captionEl: false,
    shareEl: false
  }).init()
}
