<template lang="pug">
  v-app
    AppBar

    v-content: v-container
      v-expansion-panels: v-expansion-panel(v-for="member in members" :key="member.id")
        v-expansion-panel-header
          div: LazyImage(
            v-if="member.profile_image_urls"
            type="avatar"
            :lazySrc="image(member.profile_image_urls.px_170x170).profile_small"
            alt="Avatar"
          )
          .title {{ member.name }}

        v-expansion-panel-content: v-container(grid-list-xl): v-layout(wrap): v-flex(
            v-for="illust in member.illusts"
            :key="illust.id"
            xs6 sm4 lg2
          )
            div(
              @click=`loaded(illust) && gallery({
                el: $refs.pswp.$el,
                illust,
                rect: $refs[illust.id][0].getBoundingClientRect()
              })`
              :ref="illust.id"
            ): LazyImage(
              :class="{ pointer: loaded(illust) }"
              :lazySrc=`image(
                illust.metadata
                  ? illust.metadata.pages[0].image_urls.large
                  : illust.image_urls.large
              ).small_2`
              :alt="illust.title"
            )
            .mt-1.font-weight-bold
              span.mr-1 {{ illust.title }}
              v-icon(v-if="illust.metadata") mdi-image-multiple

      v-snackbar(v-model="loading" :timeout="0") Loading...
      PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import AppBar from './components/AppBar'
import LazyImage from './components/LazyImage'
import PhotoSwipe from './components/PhotoSwipe'
import image from './utils/image'
import gallery from './utils/gallery'
import ky from 'ky'

export default {
  components: {
    AppBar,
    LazyImage,
    PhotoSwipe
  },
  data: () => ({
    config,
    members: []
  }),
  computed: {
    loading() {
      let length = 0
      this.members.forEach(member => (length += member.illusts.length))
      return !(length === config.collection.length)
    },
    // location.hash === '#&gid=[illustID]&pid=[illustIndex]'
    gid: () =>
      parseInt(
        location.hash
          .substring(2)
          .split('&')[0]
          .split('=')[1]
      ),
    pid: () =>
      parseInt(
        location.hash
          .substring(2)
          .split('&')[1]
          .split('=')[1]
      )
  },
  mounted() {
    config.collection.forEach(async illust => {
      // Covert
      if (!Array.isArray(illust)) illust = [illust]
      if (typeof illust[0] === 'string')
        illust[0] = [new URL(illust[0]).searchParams.get('illust_id')]

      // Process
      let res = await this.api(illust[0])
      if (res.metadata) {
        // Filter
        if (illust[1])
          res.metadata.pages = illust[1].map(index => res.metadata.pages[index])

        // Get image size
        res.metadata.pages.forEach(async page => {
          const img = await ky('/api/', {
            searchParams: { url: image(page.image_urls.large).original }
          }).json()

          this.$set(page, 'height', img.height)
          this.$set(page, 'width', img.width)

          // Resume
          if (illust[0] === this.gid && this.loaded(res))
            this.gallery({
              el: this.$refs.pswp.$el,
              illust: res,
              index: this.pid - 1
            })
        })
      } else if (illust[0] === this.gid)
        this.gallery({ el: this.$refs.pswp.$el, illust: res })

      // Save
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
    })
  },
  methods: {
    api: async (id, type = 'illust') =>
      (await ky('https://api.imjad.cn/pixiv/v1/', {
        searchParams: { id, type }
      }).json()).response[0],
    image,
    gallery,
    loaded: illust =>
      !illust.metadata || illust.metadata.pages.every(page => page.width)
  }
}
</script>

<style lang="sass" scoped>
.pointer
  cursor: pointer
</style>
