import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'
import image from './image'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import zh_CN from 'dayjs/locale/zh-cn'

dayjs.extend(LocalizedFormat)

export default (pswp, illust, index, rect) => {
  const time = navigator.languages.some(lang => lang === 'zh-CN')
    ? dayjs(illust.create_date)
        .locale(zh_CN)
        .format('lll')
    : dayjs(illust.create_date).format('lll')
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
    <div class="caption grey--text text--lighten-1">${[
      time,
      ...illust.tags.map(tag => tag.name)
    ].join(' #')}</div>
  `

  new PhotoSwipe(
    pswp,
    PhotoSwipeUI,
    illust.meta_pages.length
      ? illust.meta_pages.map((page, index) => ({
          src: image(page.image_urls.original).original,
          msrc: image(page.image_urls.original).small,
          h: page.height,
          w: page.width,
          title: index === 0 && title
        }))
      : [
          {
            src: image(illust.meta_single_page.original_image_url).original,
            msrc: image(illust.meta_single_page.original_image_url).small,
            h: illust.height,
            w: illust.width,
            title
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
}
