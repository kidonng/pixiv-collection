# pixiv Collection

Simple pixiv collection showcase.

## Features

- Material Design 2 via Vuetify
- Gallery view via Photoswipe
- Image lazy load
- Categorized by illustrators automatically
- Support multiple page illustration

## Usage

Add your [config and collection](./config.js).

```js
export default {
  // ...
  collection: [
    // ID
    20959870,
    {
      // Link is fine too
      id:
        'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=20959870',
      // Favourite ❤️
      favorite: true,
      // Select by indexes (starting from 0)
      indexes: [0, 10],
      // Exclude selected
      exclude: true,
      // Cover (index of filtered pages)
      cover: 5
    }
  ]
}
```

Then:

- Setup `yarn`
- Development `yarn serve`
- Build `yarn build`

## Thanks

pixiv Collection is made possible by:

- [pixiv API](https://api.imjad.cn/pixiv_v2.md)
- [pixiv proxy](https://pixiv.cat/reverseproxy.html)
