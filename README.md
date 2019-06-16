# pixiv Collection

Simple pixiv collection showcase.

## Features

- Material Design 2 via Vuetify
- Gallery view via Photoswipe
- Image lazy load
- Categorized by illustrator automatically
- Support mutilple page illustration

## Usage

1. Add your [config and collection](./config.js).
  Following collection formats are supported (index starts from 0; all pages will be shown if indexes not provided):

  - ID `48121730`
  - ID & page indexes `[53331058, [1, 2, 4, 8]]`
  - Link `'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48797786'`

2. Modify [page title](https://github.com/kidonng/pixiv-collection/blob/master/public/index.html#L5) as well.
3. That's it!

  - Setup `yarn`
  - Development `yarn serve`
  - Build `yarn build`

## Thanks

pixiv Collection is made possible by:

- [pixiv API](https://api.imjad.cn/pixiv.md)
- [pixiv proxy](https://pixiv.cat/reverseproxy.html)
