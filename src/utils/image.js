export default original => {
  const prefix = 'https://i.pixiv.cat/'
  const extension = original.substring(original.length - 4)

  if (original.includes('user-profile')) {
    const base = original.substring(
      original.indexOf('/img/'),
      original.lastIndexOf('_')
    )

    return {
      medium: `${prefix}user-profile${base}_170${extension}`,
      small: `${prefix}user-profile${base}_50${extension}`
    }
  } else {
    const base = original.substring(
      original.indexOf('/img/'),
      original.lastIndexOf('.')
    )
    const jpg = '.jpg'

    return {
      // Must provide the original link to get the correct extension
      original: `${prefix}img-original${base}${extension}`,
      large: `${prefix}c/600x1200_90_webp/img-master${base}_master1200${jpg}`,
      medium: `${prefix}c/600x600/img-master${base}_master1200${jpg}`,
      medium_2: `${prefix}c/480x960/img-master${base}_master1200${jpg}`,
      medium_3: `${prefix}c/540x540_70/img-master${base}_master1200${jpg}`,
      medium_3_square: `${prefix}c/540x540_10_webp/img-master${base}_square1200${jpg}`,
      small: `${prefix}c/150x150/img-master${base}_master1200${jpg}`,
      small_square: `${prefix}c/128x128/img-master${base}_square1200${jpg}`,
      // Used by pixiv
      small_2: `${prefix}c/250x250_80_a2/img-master${base}_square1200${jpg}`
    }
  }
}
