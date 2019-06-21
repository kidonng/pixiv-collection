import config from '../../config'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import galite from 'ga-lite'
import time from './time'

export default (pswpElement, illust, index, rect) => {
  if (config.googleAnalyticsID)
    galite('send', {
      hitType: 'event',
      eventCategory: illust.user.name,
      eventAction: 'View',
      eventLabel: `${illust.title} (${illust.id})`
    })

  const title = `
    <div class="title">${illust.title}</div>
    <div class="subtitle-1 font-weight-bold mb-1">
      ${illust.user.name}
      ${
        illust.favorite
          ? '<i aria-hidden="true" class="v-icon mdi mdi-heart theme--light ml-2 red--text favorite-icon"></i>'
          : ''
      }
    </div>
    ${
      illust.caption
        ? `<div class="body-2 grey--text text--darken-2 mb-2">${illust.caption}</div>`
        : ''
    }
    <div class="caption grey--text">${[
      time(illust.create_date, navigator).format('lll'),
      ...illust.tags.map(tag => tag.name)
    ].join(' #')}</div>
  `

  const items = illust.meta_pages.length
    ? illust.meta_pages.map((page, index) => ({
        src: page.image_urls.original,
        msrc: page.image_urls.small,
        h: page.height,
        w: page.width,
        title: index === 0 && title
      }))
    : [
        {
          src: illust.meta_single_page.original_image_url,
          msrc: illust.image_urls.small,
          h: illust.height,
          w: illust.width,
          title
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
    shareButtons: [
      {
        label: 'View on pixiv',
        url: `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`
      },
      {
        label: 'View illustrator profile',
        url: `https://www.pixiv.net/member.php?id=${illust.user.id}`
      },
      { label: 'Raw image', url: '{{raw_image_url}}' }
    ].map(btn => ({ id: 'download', download: true, ...btn }))
  }

  const pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
  pswp.listen(
    'initialZoomIn',
    () =>
      (document.title = `${illust.title} / ${illust.user.name} - ${config.title}`)
  )
  pswp.listen('destroy', () =>
    // The title displayed in Chrome (other browsers not tested) will revert if there's no delay
    setTimeout(() => (document.title = config.title), 50)
  )
  pswp.init()
}
