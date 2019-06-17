import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'
import image from './image'

export default ({ el, illust, index, rect }) =>
  new PhotoSwipe(
    el,
    PhotoSwipeUI,
    illust.metadata
      ? illust.metadata.pages.map((page, index) => ({
          src: image(page.image_urls.large).original,
          msrc: image(page.image_urls.large).small,
          h: page.height,
          w: page.width,
          title:
            index === 0 &&
            `${
              illust.caption ? `<strong>${illust.caption}</strong>` : ''
            } ${new Date(illust.created_time).toLocaleDateString()}`
        }))
      : [
          {
            src: image(illust.image_urls.large).original,
            msrc: image(illust.image_urls.large).small,
            h: illust.height,
            w: illust.width,
            title: `${
              illust.caption ? `<strong>${illust.caption}</strong>` : ''
            } ${new Date(illust.created_time).toLocaleDateString()}`
          }
        ],
    {
      index,
      getThumbBoundsFn: () =>
        rect && { x: rect.left, y: rect.top + window.scrollY, w: rect.width },
      showHideOpacity: true,
      galleryUID: illust.id,
      barsSize: { top: 0, bottom: 0 },
      loadingIndicatorDelay: 0,
      shareButtons: [
        {
          id: 'download',
          label: 'View on pixiv',
          url: `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`,
          download: true
        },
        {
          id: 'download',
          label: 'View illustrator profile',
          url: `https://www.pixiv.net/member.php?id=${illust.user.id}`,
          download: true
        },
        {
          id: 'download',
          label: 'Raw image',
          url: '{{raw_image_url}}',
          download: true
        }
      ]
    }
  ).init()
