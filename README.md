# pixiv Collection

Simple pixiv collection showcase.

## Features

- Material Design 2
- Zoomable gallery for single/multiple page
- Highly customizable collection
- Categorized by illustrators automatically
- Illustration & illustrator info view
- Image lazy load
- Lots of other optimization

## Usage

1. The APIs are developed for [Now](https://zeit.co/now) and if you don't have a ZEIT account, [register](https://zeit.co/signup) one for free.
2. Fork/clone the repo and set your [config and collection](./config.js):

```js
export default {
  // ...
  collection: [
    // ID
    20959870,
    {
      // Link is supported too
      id:
        'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=20959870',
      // Favourite ❤️
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

3. Config [page title](./public/index.html#L5) and [Now alias](./now.json#L25) as well.
4. Deploy to Now and check your awesome collection!

## Development

- Setup `yarn`
- Run `yarn serve`
- Build `yarn build`

## Thanks

pixiv Collection is made possible by:

- [pixiv API](https://api.imjad.cn/pixiv_v2.md)
- [pixiv image proxy](https://pixiv.cat/reverseproxy.html)
