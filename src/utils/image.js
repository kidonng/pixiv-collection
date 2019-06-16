export default original => {
  const prefix = 'https://i.pixiv.cat/'

  if (original.includes('_p')) {
    const base = original.substring(
      original.indexOf('/img/'),
      original.lastIndexOf('.')
    )
    const suffix = '.jpg'

    return {
      original: `${prefix}img-original${base}${original.substring(
        original.length - 4
      )}`,
      large: `${prefix}c/600x1200_90_webp/img-master${base}_master1200${suffix}`,
      medium: `${prefix}c/600x600/img-master${base}_master1200${suffix}`,
      medium_2: `${prefix}c/480x960/img-master${base}_master1200${suffix}`,
      medium_3: `${prefix}c/540x540_70/img-master${base}_master1200${suffix}`,
      medium_3_square: `${prefix}c/540x540_10_webp/img-master${base}_square1200${suffix}`,
      small: `${prefix}c/150x150/img-master${base}_master1200${suffix}`,
      small_square: `${prefix}c/128x128/img-master${base}_square1200${suffix}`,
      small_2: `${prefix}c/250x250_80_a2/img-master${base}_square1200${suffix}`
    }
  } else {
    const base = original.substring(
      original.indexOf('/img/'),
      original.lastIndexOf('_')
    )
    const suffix = original.substring(original.length - 4)

    return {
      profile_medium: `${prefix}user-profile${base}_170${suffix}`,
      profile_small: `${prefix}user-profile${base}_50${suffix}`
    }
  }
}
