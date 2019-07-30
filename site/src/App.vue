<template>
  <v-app>
    <AppBar />

    <v-content :class="{ 'cur-wait': loading }">
      <v-container :px-0="breakpoint('xs')" :fill-height="loading">
        <v-layout v-if="loading" align-content-center justify-center wrap>
          <v-flex xs12 subtitle-1 text-center>
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
import { value, computed, onMounted } from 'vue-function-api'
import ky from 'ky'
import AppBar from './components/AppBar'
import Illust from './components/Illust'
import PanelHeader from './components/PanelHeader'
import PhotoSwipe from './components/PhotoSwipe'
import gallery from './utils/gallery'
import config from '../config'

export default {
  components: {
    AppBar,
    Illust,
    PanelHeader,
    PhotoSwipe
  },
  setup(props, context) {
    const members = value([])

    const loading = computed(() => {
      const sum = members.value
        .map(member => member.illusts.length)
        .reduce((sum, current) => sum + current, 0)

      return sum !== config.collection.length
    })

    const vuetify = context.root.$vuetify
    const breakpoint = name => vuetify.breakpoint.name === name

    onMounted(() => {
      // Dark theme
      const dark = window.matchMedia('(prefers-color-scheme: dark)')
      vuetify.theme.dark = dark.matches
      dark.addEventListener('change', e => (vuetify.theme.dark = e.matches))

      const searchParams = new URLSearchParams(location.hash.substring(2))

      // Process collection
      config.collection.forEach(async illust => {
        // Covert ID and link
        if (typeof illust !== 'object') illust = { id: illust }
        if (typeof illust.id === 'string')
          illust.id = [new URL(illust.id).searchParams.get('illust_id')]

        try {
          let res = (await ky('/api', {
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
          if (res.id === parseInt(searchParams.get('gid')))
            gallery(res, parseInt(searchParams.get('pid')) - 1)

          const member = members.value.find(
            member => member.user.id === res.user.id
          )
          if (member) member.illusts.push(res)
          else members.value.push({ illusts: [res], user: res.user })
        } catch {
          console.error('Failed to load illust')
        }
      })
    })

    return {
      members,
      loading,
      breakpoint
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
