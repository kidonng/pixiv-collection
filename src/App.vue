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
    searchParams: () => new URLSearchParams(location.hash.substring(2))
  },
  mounted() {
    config.collection.forEach(async (illust, index) => {
      // Covert
      if (typeof illust !== 'object') illust = { id: illust }
      if (typeof illust.id === 'string')
        illust.id = [new URL(illust.id).searchParams.get('illust_id')]

      // Process
      let res = (await ky('/api/', {
        searchParams: { id: illust.id }
      }).json()).illust

      if (illust.favorite) res.favorite = true

      if (res.meta_pages.length) {
        // Copy for cover index
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
      }

      // Resume
      if (res.id === parseInt(this.searchParams.get('gid')))
        gallery(
          this.$refs.pswp.$el,
          res,
          parseInt(this.searchParams.get('pid')) - 1
        )

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
a
  text-decoration: none

.px-0-child > div
  padding-right: 0
  padding-left: 0

// Temp fix https://github.com/vuetifyjs/vuetify/issues/7524
.fix-panel
  flex: 1 0 100%
</style>
