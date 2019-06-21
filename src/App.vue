<template lang="pug">
  v-app
    AppBar

    v-content: v-container(
      fluid
      px-0
      :fill-height="loading"
    )
      v-layout(
        v-if="loading"
        align-content-center
        justify-center
        wrap
      )
        v-flex(
          xs12
          subtitle-1
          text-xs-center
        ) Loading
        v-flex(xs6): v-progress-linear(
          indeterminate
          rounded
          height="6"
        )

      v-expansion-panels(v-else popout): v-expansion-panel.fix-panel(
        v-for="member in members"
        :key="member.user.id"
      )
        PanelHeader(:member="member")

        v-expansion-panel-content(:class="{ 'px-0-child': breakpoint('xs') }"): v-container(
          :grid-list-xl="!breakpoint('xs')"
          px-0
        ): v-layout(wrap): Illust(
          v-for="illust in member.illusts"
          :key="illust.id"
          :illust="illust"
          :pswp="$refs.pswp.$el"
        )

      PhotoSwipe(ref="pswp")
</template>

<script>
import config from '../config'
import AppBar from './components/AppBar'
import Illust from './components/Illust'
import PanelHeader from './components/PanelHeader'
import PhotoSwipe from './components/PhotoSwipe'
import gallery from './utils/gallery'
import ky from 'ky'
import galite from 'ga-lite'

export default {
  components: {
    AppBar,
    Illust,
    PanelHeader,
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
    if (config.googleAnalyticsID) {
      galite('create', config.googleAnalyticsID, 'auto')
      galite('send', 'pageview')
    }

    document.title = config.title

    config.collection.forEach(async (illust, index) => {
      // Covert
      if (typeof illust !== 'object') illust = { id: illust }
      if (typeof illust.id === 'string')
        illust.id = [new URL(illust.id).searchParams.get('illust_id')]

      // Process
      let res = (await ky('/api/pixiv/', {
        searchParams: { id: illust.id }
      }).json()).illust

      if (illust.favorite) res.favorite = true

      if (res.meta_pages.length) {
        const pages = [...res.meta_pages]

        // Filter
        if (illust.pages)
          res.meta_pages = res.meta_pages.filter((page, index) =>
            illust.exclude
              ? !illust.pages.includes(index + 1)
              : illust.pages.includes(index + 1)
          )

        if (illust.cover)
          res.cover = res.meta_pages.indexOf(pages[illust.cover - 1])

        res.meta_pages.forEach(async page => {
          // Get image size
          const img = await ky('/api/image/', {
            searchParams: { url: page.image_urls.original }
          }).json()
          this.$set(page, 'height', img.height)
          this.$set(page, 'width', img.width)

          // Resume
          if (
            illust.id === this.idSet[0] &&
            res.meta_pages.every(page => page.width)
          )
            gallery(this.$refs.pswp.$el, res, this.idSet[1] - 1)
        })
      } else if (illust.id === this.idSet[0]) gallery(this.$refs.pswp.$el, res)

      // Save
      const member = this.members.find(member => member.user.id === res.user.id)
      if (member) member.illusts.push(res)
      else this.members.push({ illusts: [res], user: res.user })

      if (index + 1 === config.collection.length) this.loading = false
    })
  },
  methods: {
    breakpoint(name) {
      return this.$vuetify.breakpoint.name === name
    }
  }
}
</script>

<style lang="sass">
.px-0-child > div
  padding-right: 0
  padding-left: 0

// Temp fix https://github.com/vuetifyjs/vuetify/issues/7524
.fix-panel
  flex: 1 0 100%
</style>
