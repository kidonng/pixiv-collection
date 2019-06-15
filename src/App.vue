<template lang="pug">
v-app
  v-app-bar(app dark)
    v-toolbar-title {{ title }}
    v-spacer
    v-tooltip(v-for="(link, index) in links" :key="index" bottom)
      template(#activator="{ on }"): v-btn(
        v-on="on"
        :href="link.href"
        target="_blank"
        rel="noreferrer noopener"
        icon
      ): v-icon {{ link.icon }}
      span {{ link.title }}

  v-content: v-container
    v-snackbar(:value="!collection.length") Loading...

    v-expansion-panels.hotfix: v-expansion-panel(v-for="(member, memberIndex) in collection" :key="member.id")
      v-expansion-panel-header
        div: a(
          :href="`https://www.pixiv.net/member.php?id=${member.id}`"
          title="View pixiv profile"
          target="_blank"
          rel="noreferrer noopener"
        ): LazyImage(
          type="avatar"
          :lazySrc="member.profile_image_urls.px_50x50"
          alt="Avatar"
        )
        .title {{ member.name }}

      v-expansion-panel-content: v-container(grid-list-xl): v-layout(wrap): v-flex(
          v-for="(illust, illustIndex) in member.illust"
          :key="illust.id"
          xs6 sm4 lg2
        )
          div(@click="zoom(memberIndex, illustIndex)"): LazyImage(:lazySrc="illust.image_urls.thumb" :alt="illust.title")
          .mt-1.font-weight-bold(:title="`${illust.caption} (${illust.created_time.substring(0, 16)})`") {{ illust.title }}

    PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import LazyImage from './components/LazyImage'
import PhotoSwipe from './components/PhotoSwipe'
import ky from 'ky'
import Photoswipe from 'photoswipe'
import PhotoswipeUI from 'photoswipe/dist/photoswipe-ui-default'

export default {
  components: {
    LazyImage,
    PhotoSwipe
  },
  data: () => ({
    title: config.title,
    links: config.links,
    collection: []
  }),
  mounted() {
    config.collection.forEach(async (member, memberIndex) => {
      this.collection.push(
        Object.assign(await this.api(member.id, 'member'), { illust: [] })
      )
      member.illust.forEach(async (illust, illustIndex) => {
        this.collection[memberIndex].illust.push(await this.api(illust))

        // Resume from hash
        if (location.hash && location.hash.includes('#&gid')) {
          const gid = location.hash
            .substring(2)
            .split('&')[0]
            .split('=')[1]
          const pid = location.hash
            .substring(2)
            .split('&')[1]
            .split('=')[1]
          // gid & pid are strings, so we use - to convert them
          if (memberIndex === gid - 1 && illustIndex === pid - 1)
            this.zoom(memberIndex, illustIndex)
        }
      })
    })
  },
  methods: {
    replace(urls) {
      Object.keys(urls).forEach(
        url => (urls[url] = urls[url].replace('i.pximg.net', 'i.pixiv.cat'))
      )
    },
    async api(id, type = 'illust') {
      const res = (await ky('https://api.imjad.cn/pixiv/v1/', {
        searchParams: { type, id }
      }).json()).response[0]

      if (type === 'illust') {
        this.replace(res.image_urls)
        // Thumbnail used on pixiv user profile
        res.image_urls.thumb = res.image_urls.px_128x128.replace(
          '128x128',
          '250x250_80_a2'
        )
      } else if (type === 'member') this.replace(res.profile_image_urls)

      return res
    },
    zoom(memberIndex, illustIndex) {
      const el = this.$refs.pswp.$el
      const items = []

      this.collection[memberIndex].illust.forEach(illust =>
        items.push({
          src: illust.image_urls.large,
          msrc: illust.image_urls.small,
          h: illust.height,
          w: illust.width
        })
      )
      el.querySelector(
        '.pswp__button--view-on-pixiv'
      ).parentElement.href = `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${this.collection[memberIndex].illust[illustIndex].id}`

      new Photoswipe(el, PhotoswipeUI, items, {
        galleryUID: memberIndex + 1,
        index: illustIndex,
        barsSize: { top: 0, bottom: 0 },
        captionEl: false,
        shareEl: false
      }).init()
    }
  }
}
</script>

<style lang="sass" scoped>
// Hotfix for https://github.com/vuetifyjs/vuetify/issues/7524
.hotfix .v-expansion-panel
  flex: 1 0 100%
</style>
