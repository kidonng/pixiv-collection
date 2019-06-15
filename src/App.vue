<template lang="pug">
v-app
  AppBar

  v-content: v-container
    v-expansion-panels: v-expansion-panel(v-for="member in members" :key="member.id")
      v-expansion-panel-header
        div: LazyImage(v-if="member.profile_image_urls" type="avatar" :lazySrc="member.profile_image_urls.px_50x50" alt="Avatar")
        .title {{ member.name }}

      v-expansion-panel-content: v-container(grid-list-xl): v-layout(wrap): v-flex(
          v-for="illust in member.illusts"
          :key="illust.id"
          xs6 sm4 lg2
        )
          div(@click="photoswipe(member, illust.id, $refs.pswp.$el)"): LazyImage(
            :lazySrc="illust.image_urls.thumb"
            :alt="illust.title"
          )

          v-tooltip(bottom)
            template(#activator="{ on }"): .pointer.mt-1.font-weight-bold(
              v-on="on"
              @click="dialog = { show: true, illust }"
            ) {{ illust.title }}
            span View details

    v-snackbar(:value="!loaded") Loading...
    Dialog(:dialog="dialog")
    PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import AppBar from './components/AppBar'
import Dialog from './components/Dialog'
import LazyImage from './components/LazyImage'
import PhotoSwipe from './components/PhotoSwipe'
import photoswipe from './utils/photoswipe'
import ky from 'ky'

export default {
  components: {
    AppBar,
    Dialog,
    LazyImage,
    PhotoSwipe
  },
  data: () => ({
    config,
    members: [],
    loaded: false,
    dialog: {
      show: false,
      illust: null
    }
  }),
  mounted() {
    config.collection.forEach(async illust => {
      const res = await this.api(illust)
      let member = this.members.find(member => member.id === res.user.id)

      if (member) member.illusts.push(res)
      else {
        member = {
          id: res.user.id,
          illusts: [res]
        }
        this.members.push(member)

        member = Object.assign(member, await this.api(member.id, 'member'))
      }

      // location.hash === '#&gid=?&pid=?'
      if (
        location.hash &&
        illust ===
          parseInt(
            location.hash
              .substring(2)
              .split('&')[1]
              .split('=')[1]
          )
      )
        this.photoswipe(member, illust, this.$refs.pswp.$el)

      if (illust === config.collection.slice(-1)[0]) this.loaded = true
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
    photoswipe
  }
}
</script>

<style lang="sass">
.pointer
  cursor: pointer
</style>
