<h1 align="center">pixiv Collection</h1>

<div align="center">

[![Website](https://img.shields.io/website/https/pixiv.now.sh.svg?style=for-the-badge)](https://pixiv.now.sh/)
[![GitHub](https://img.shields.io/github/license/kidonng/pixiv-collection.svg?style=for-the-badge)](./LICENSE)

English | [简体中文](README-zh-CN.md)

</div>

Simple pixiv collection showcase.

| Desktop                      | Mobile                      |
| ---------------------------- | --------------------------- |
| ![](screenshots/desktop.png) | ![](screenshots/mobile.png) |

## Features

- Material Design 2
- Zoomable gallery
- Highly customizable collection
- Categorized by illustrators automatically
- Illustration & illustrator info view
- Image lazy load

## Usage

1. The APIs are developed for [Now](https://zeit.co/now) and if you don't have a ZEIT account, [register](https://zeit.co/signup) one for free.
2. Fork/clone the repo and configure your [preferences and collection](packages/site/config.js):

```js
export default {
  // ...
  collection: [
    // Illustration ID
    20959870,
    {
      // Or link
      id:
        'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=20959870',
      // Favorite ❤️
      favorite: true,
      // Select by page
      pages: [1, 11],
      // Exclude selected
      exclude: true,
      // Cover
      cover: 7
    }
  ]
}
```

3. Config [page title](packages/site/public/index.html#L5) and [Now alias](now.json#L25) (optional) as well.
4. Deploy to Now and check your awesome collection!

## Development

- Setup `yarn` & `yarn add now --dev`
- Run `now dev`
- Build `yarn build`

## Thanks

pixiv Collection is made possible by the following projects:

- [pixiv API](https://api.imjad.cn/pixiv_v2.md)
- [pixiv image proxy](https://pixiv.cat/reverseproxy.html)
