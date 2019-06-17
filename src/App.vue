<template lang="pug">
v-app
  AppBar

  v-content: v-container
    v-expansion-panels: v-expansion-panel(v-for="member in members" :key="member.id")
      v-expansion-panel-header
        div: LazyImage(v-if="member.profile_image_urls" type="avatar" :lazySrc="image(member.profile_image_urls.px_170x170).profile_small" alt="Avatar")
        .title {{ member.name }}

      v-expansion-panel-content: v-container(grid-list-xl): v-layout(wrap): v-flex(
          v-for="illust in member.illusts"
          :key="illust.id"
          xs6 sm4 lg2
        )
          div(@click="photoswipe(illust, $refs.pswp.$el)"): LazyImage(
            :lazySrc=`
              image(illust.metadata
                ? illust.metadata.pages[0].image_urls.large
                : illust.image_urls.large
              ).small_2
            `
            :alt="illust.title"
          )

          v-tooltip(bottom)
            template(#activator="{ on }"): .pointer.mt-1.font-weight-bold(
              v-on="on"
              @click="dialog = { show: true, illust }"
            ) {{ illust.title }}
            span View details

    v-snackbar(v-model="loading" :timeout="0") Loading...
    Dialog(:dialog="dialog")
    PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import AppBar from './components/AppBar'
import Dialog from './components/Dialog'
import LazyImage from './components/LazyImage'
import PhotoSwipe from './components/PhotoSwipe'
import image from './utils/image'
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
    loading: true,
    dialog: {
      show: false,
      illust: null
    }
  }),
  mounted() {
    config.collection.forEach(async (illust, index) => {
      // Covert
      if (!Array.isArray(illust)) illust = [illust]
      if (typeof illust[0] === 'string')
        illust[0] = [new URL(illust[0]).searchParams.get('illust_id')]

      // location.hash === '#&gid=[illustID]&pid=[illustIndex]'
      let gid
      let pid
      if (location.hash) {
        gid = parseInt(
          location.hash
            .substring(2)
            .split('&')[0]
            .split('=')[1]
        )
        pid = parseInt(
          location.hash
            .substring(2)
            .split('&')[1]
            .split('=')[1]
        )
      }

      // Process
      let res = await this.api(illust[0])
      if (res.metadata) {
        // Filter
        if (illust[1])
          res.metadata.pages = illust[1].map(index => res.metadata.pages[index])

        res.metadata.pages.forEach(async page => {
          const img = await ky('/api/', {
            searchParams: { url: image(page.image_urls.large).original }
          }).json()

          page.height = img.height
          page.width = img.width

          // Resume
          if (illust[0] === gid && res.metadata.pages.every(page => page.width))
            this.photoswipe(res, this.$refs.pswp.$el, pid - 1)
        })
      } else if (illust[0] === gid) this.photoswipe(res, this.$refs.pswp.$el, 0)

      // Store
      let member = this.members.find(member => member.id === res.user.id)
      if (member) member.illusts.push(res)
      else {
        member = {
          id: res.user.id,
          illusts: [res]
        }
        this.members.push(member)

        Object.assign(member, await this.api(member.id, 'member'))
      }

      if (index + 1 === config.collection.length) this.loading = false
    })
  },
  methods: {
    api: async (id, type = 'illust') =>
      (await ky('https://api.imjad.cn/pixiv/v1/', {
        searchParams: { id, type }
      }).json()).response[0],
    image,
    photoswipe
  }
}
</script>

<style lang="sass">
.pointer
  cursor: pointer
</style>
