import config from '../../config'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import galite from 'ga-lite'

export default (illust, index, rect) => {
  if (config.googleAnalyticsID)
    galite('send', {
      hitType: 'event',
      eventCategory: illust.user.name,
      eventAction: 'View',
      eventLabel: `${illust.title} (${illust.id})`
    })

  const items = illust.meta_pages.length
    ? illust.meta_pages.map(page => ({
        src: page.image_urls.original,
        msrc: page.image_urls.small,
        h: page.height,
        w: page.width
      }))
    : [
        {
          src: illust.meta_single_page.original_image_url,
          msrc: illust.image_urls.small,
          h: illust.height,
          w: illust.width
        }
      ]

  const options = {
    index,
    getThumbBoundsFn: () =>
      rect && {
        x: rect.left,
        y: rect.top + window.pageYOffset,
        w: rect.width
      },
    showHideOpacity: true,
    galleryUID: illust.id,
    // UI Options
    barsSize: { top: 0, bottom: 0 },
    loadingIndicatorDelay: 0,
    captionEl: false,
    shareEl: false,
    clickToCloseNonZoomable: false
  }

  const pswp = new PhotoSwipe(
    document.querySelector('.pswp'),
    PhotoSwipeUI_Default,
    items,
    options
  )
  pswp.listen(
    'initialZoomIn',
    () =>
      (document.title = `${illust.title} / ${illust.user.name} - ${config.title}`)
  )
  pswp.listen('destroy', () =>
    // Title in Chrome will revert without the timeout
    setTimeout(() => (document.title = config.title), 50)
  )
  pswp.init()
}
