<template>
  <v-app>
    <AppBar />

    <v-content :class="{ 'cur-wait': loading }">
      <v-container :px-0="breakpoint('xs')" :fill-height="loading">
        <v-layout v-if="loading" align-content-center justify-center wrap>
          <v-flex xs12 subtitle-1 text-xs-center>
            Loading collection
          </v-flex>
          <v-flex xs6>
            <v-progress-linear indeterminate rounded height="6" />
          </v-flex>
        </v-layout>

        <v-expansion-panels v-else>
          <v-expansion-panel v-for="member in members" :key="member.user.id">
            <PanelHeader :member="member" />
            <v-expansion-panel-content
              :class="{ 'px-0-child-div': breakpoint('xs') }"
            >
              <v-container :grid-list-xl="!breakpoint('xs')" px-0>
                <v-layout wrap>
                  <Illust
                    v-for="illust in member.illusts"
                    :key="illust.id"
                    :illust="illust"
                  />
                </v-layout>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <PhotoSwipe />
      </v-container>
    </v-content>
  </v-app>
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
    members: [],
    searchParams: new URLSearchParams(location.hash.substring(2))
  }),
  computed: {
    loading() {
      return (
        this.members
          .map(member => member.illusts.length)
          .reduce((sum, current) => sum + current, 0) !==
        config.collection.length
      )
    }
  },
  mounted() {
    // Dark theme
    const dark = matchMedia('(prefers-color-scheme: dark)')
    dark.addListener(e => (this.$vuetify.theme.dark = e.matches))
    this.$vuetify.theme.dark = dark.matches

    // Process collection
    config.collection.forEach(async illust => {
      // Covert ID and link
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

        if (illust.pages)
          res.meta_pages = res.meta_pages.filter((page, index) =>
            illust.exclude
              ? !illust.pages.includes(index + 1)
              : illust.pages.includes(index + 1)
          )

        if (illust.cover)
          res.cover = res.meta_pages.indexOf(pages[illust.cover - 1])
      }

      // Resume gallery view
      if (res.id === parseInt(this.searchParams.get('gid')))
        gallery(res, parseInt(this.searchParams.get('pid')) - 1)

      const member = this.members.find(member => member.user.id === res.user.id)
      if (member) member.illusts.push(res)
      else this.members.push({ illusts: [res], user: res.user })
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

.cur-wait
  cursor: wait

.cur-help
  cursor: help

.cur-zoom-in
  cursor: zoom-in

.px-0-child-div > div
  padding-right: 0
  padding-left: 0
</style>
