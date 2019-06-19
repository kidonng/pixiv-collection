# pixiv Collection

Simple pixiv collection showcase.

## Features

- Material Design 2 via Vuetify
- Gallery view via Photoswipe
- Image lazy load
- Categorized by illustrators automatically
- Support multiple page illustration

## Usage

1. Add your [config and collection](./config.js).

```js
export default {
  // ...
  collection: [
    // ID
    5331058,
    // Link
    'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=53331058',
    // Favourite ❤️
    [5331058, true],
    // Select by indexes (starting from 0; set `true` for all)
    [53331058, true, [1, 2, 4, 8]],
    // Cover (index of filtered pages)
    [5331058, true, [1, 2, 4, 8], [1]],
    // Exclude mode
    [5331058, true, [1, 2, 4, 8], [1, true]]
  ]
}
```

2. Modify [page title](https://github.com/kidonng/pixiv-collection/blob/master/public/index.html#L5) as well.
3. That's it!

- Setup `yarn`
- Development `yarn serve`
- Build `yarn build`

## Thanks

pixiv Collection is made possible by:

- [pixiv API](https://api.imjad.cn/pixiv_v2.md)
- [pixiv proxy](https://pixiv.cat/reverseproxy.html)
