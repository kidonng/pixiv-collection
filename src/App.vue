<template lang="pug">
  v-app
    AppBar

    v-content: v-container(fluid pa-0)
      v-expansion-panels: v-expansion-panel.fix-panel(
        v-for="member in members"
        :key="member.id"
      )
        PanelHeader(:member="member")

        v-expansion-panel-content: v-container(
          :grid-list-xl="$vuetify.breakpoint.name !== 'xs'"
          px-0
        ): v-layout(wrap): Illust(
          v-for="illust in member.illusts"
          :key="illust.id"
          :illust="illust"
          :pswp="$refs.pswp.$el"
        )

      v-snackbar(v-model="loading" auto-height :timeout="0")
        | Loading...
        | If the message persists, mostly because this is your first visit, you may not be able to see the complete collection.
        | To solve the problem, please refresh the page.
        v-btn(@click="loading = false" text) Close

      PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import AppBar from './components/AppBar'
import PanelHeader from './components/PanelHeader'
import Illust from './components/Illust'
import PhotoSwipe from './components/PhotoSwipe'
import image from './utils/image'
import gallery from './utils/gallery'
import ky from 'ky'

export default {
  components: {
    AppBar,
    PanelHeader,
    Illust,
    PhotoSwipe
  },
  data: () => ({
    config,
    members: [],
    loading: true
  }),
  computed: {
    // location.hash === '#&gid=[illustID]&pid=[illustIndex]'
    idSet: () =>
      location.hash
        .substring(2)
        .split('&')
        .map(id => parseInt(id.split('=')[1]))
  },
  mounted() {
    document.title = config.title

    config.collection.forEach(async (illust, index) => {
      // Covert
      if (!Array.isArray(illust)) illust = [illust]
      if (typeof illust[0] === 'string')
        illust[0] = [new URL(illust[0]).searchParams.get('illust_id')]

      // Process
      let res = (await ky('/api/pixiv/', {
        searchParams: { id: illust[0] }
      }).json()).illust

      if (illust[1]) res.favorite = true
      if (illust[3]) res.cover = illust[3]

      if (res.meta_pages.length) {
        // Filter
        if (Array.isArray(illust[2]))
          res.meta_pages = illust[2].map(index => res.meta_pages[index])

        res.meta_pages.forEach(async page => {
          // Get image size
          const img = await ky('/api/image/', {
            searchParams: { url: image(page.image_urls.original).original }
          }).json()
          this.$set(page, 'height', img.height)
          this.$set(page, 'width', img.width)

          // Resume
          if (
            illust[0] === this.idSet[0] &&
            res.meta_pages.every(page => page.width)
          )
            gallery(this.$refs.pswp.$el, res, this.idSet[1] - 1)
        })
      } else if (illust[0] === this.idSet[0]) gallery(this.$refs.pswp.$el, res)

      // Save
      const member = this.members.find(member => member.id === res.user.id)
      if (member) member.illusts.push(res)
      else this.members.push(Object.assign({ illusts: [res] }, res.user))

      if (index + 1 === config.collection.length) this.loading = false
    })
  }
}
</script>

<style lang="sass">
// Temp fix https://github.com/vuetifyjs/vuetify/issues/7524
.fix-panel
  flex: 1 0 100%
</style>
