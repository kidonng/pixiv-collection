import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'
import image from './image'

export default ({ el, illust, index, rect }) =>
  new PhotoSwipe(
    el,
    PhotoSwipeUI,
    illust.meta_pages.length
      ? illust.meta_pages.map((page, index) => ({
          src: image(page.image_urls.original).original,
          msrc: image(page.image_urls.original).small,
          h: page.height,
          w: page.width,
          title:
            index === 0 &&
            `
              <div class="title">${illust.title}</div>
              <div class="subtitle-1">
                <span class="font-weight-bold mr-2">${illust.user.name}</span>
                <span>${new Date(
                  illust.create_date
                ).toLocaleDateString()}</span>
              </div>
              <div class="body-2">${illust.caption}</div>
              <div class="caption mt-1">${illust.tags
                .map(tag => tag.name)
                .join(' ')}</div>`
        }))
      : [
          {
            src: image(illust.meta_single_page.original_image_url).original,
            msrc: image(illust.meta_single_page.original_image_url).small,
            h: illust.height,
            w: illust.width,
            title: `
              <div class="title">${illust.title}</div>
              <div class="subtitle-1">
                <span class="font-weight-bold mr-2">${illust.user.name}</span>
                <span>${new Date(
                  illust.create_date
                ).toLocaleDateString()}</span>
              </div>
              <div class="body-2">${illust.caption}</div>
              <div class="caption mt-1">${illust.tags
                .map(tag => tag.name)
                .join(' ')}</div>`
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
