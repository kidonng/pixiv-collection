<template lang="pug">
  v-app
    AppBar

    v-content: v-container(fluid pa-0)
      v-expansion-panels: v-expansion-panel(
        v-for="member in members"
        :key="member.id"
      )
        PanelHeader(:member="member")

        v-expansion-panel-content: v-container(
          :grid-list-xl="$vuetify.breakpoint.name !== 'xs'"
          px-0
        ): v-layout(wrap): v-flex(
            v-for="illust in member.illusts"
            :key="illust.id"
            xs6 sm4 lg2
          )
            div(
              @click=`loaded(illust) && gallery(
                $refs.pswp.$el,
                illust,
                illust.cover,
                $refs[illust.id][0].getBoundingClientRect()
              )`
              :ref="illust.id"
            ): IllustThumb(:illust="illust")
            .mt-1.font-weight-bold.hidden-xs-only {{ illust.title }}

      v-snackbar(v-model="loading" :timeout="0") Loading...
      PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import AppBar from './components/AppBar'
import PanelHeader from './components/PanelHeader'
import IllustThumb from './components/IllustThumb'
import PhotoSwipe from './components/PhotoSwipe'
import image from './utils/image'
import gallery from './utils/gallery'
import ky from 'ky'

export default {
  components: {
    AppBar,
    PanelHeader,
    IllustThumb,
    PhotoSwipe
  },
  data: () => ({
    config,
    members: []
  }),
  computed: {
    loading() {
      return (
        this.members.length &&
        this.members
          .map(member => member.illusts.length)
          .reduce((prev, curr) => prev + curr) !== config.collection.length
      )
    },
    // location.hash === '#&gid=[illustID]&pid=[illustIndex]'
    idSet: () =>
      location.hash
        .substring(2)
        .split('&')
        .map(id => parseInt(id.split('=')[1]))
  },
  mounted() {
    config.collection.forEach(async illust => {
      // Covert
      if (!Array.isArray(illust)) illust = [illust]
      if (typeof illust[0] === 'string')
        illust[0] = [new URL(illust[0]).searchParams.get('illust_id')]

      // Process
      let res = (await this.api(illust[0])).illust

      if (illust[1]) res.favorite = true
      if (illust[3]) res.cover = illust[3]

      if (res.meta_pages.length) {
        // Filter
        if (Array.isArray(illust[2]))
          res.meta_pages = illust[2].map(index => res.meta_pages[index])

        // Get image size
        res.meta_pages.forEach(async page => {
          const img = await ky('/api/', {
            searchParams: { url: image(page.image_urls.original).original }
          }).json()

          this.$set(page, 'height', img.height)
          this.$set(page, 'width', img.width)

          // Resume
          if (illust[0] === this.idSet[0] && this.loaded(res))
            this.gallery(this.$refs.pswp.$el, res, this.idSet[1] - 1)
        })
      } else if (illust[0] === this.idSet[0])
        this.gallery(this.$refs.pswp.$el, res)

      // Save
      let member = this.members.find(member => member.id === res.user.id)
      if (member) member.illusts.push(res)
      else this.members.push(Object.assign({ illusts: [res] }, res.user))
    })
  },
  methods: {
    api: async (id, type = 'illust') =>
      await ky('https://api.imjad.cn/pixiv/v2/', {
        searchParams: { id, type }
      }).json(),
    image,
    gallery,
    loaded: illust => illust.meta_pages.every(page => page.width)
  }
}
</script>
