<template lang="pug">
  v-flex(xs6 sm4 lg2)
    v-card(flat :tile="breakpoint('xs')"): v-img.zoom.grey.lighten-2(
      :src="lazySrc"
      :alt="illust.title"
      aspect-ratio="1"
      max-height="250"
      max-width="250"
      ref="img"
      @click="gallery(pswp, illust, illust.cover, $refs.img.$el.getBoundingClientRect())"
    )
      v-container.fill-height.pa-1: v-layout.align-end.ma-0(column)
        v-chip(v-if="illust.meta_pages.length > 1" small)
          v-icon(left size="16") mdi-image-multiple
          .font-weight-bold {{ illust.meta_pages.length }}
        v-spacer
        v-icon(v-if="illust.favorite" color="red") mdi-heart

      template(#placeholder): v-layout(fill-height align-center justify-center ma-0)
        v-progress-circular(indeterminate color="grey lighten-5")

    v-menu(offset-x)
      template(#activator="{ on }"): .mt-1.font-weight-bold.pointer(
        v-on="on"
        :class="{ 'my-2 ml-2': breakpoint('xs') }"
      ) {{ illust.title }}

      v-card(max-width="300" max-height="400"): v-list
        v-list-item
          v-list-item-content
            v-list-item-title {{ illust.title }}
            v-list-item-subtitle {{ illust.user.name }}
          v-list-item-action
            v-btn(
              :href="`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`"
              target="_blank"
              rel="noreferrer noopener"
              icon
            ): v-icon mdi-open-in-new
        v-list-item(v-if="illust.caption")
          v-list-item-icon: v-icon mdi-information
          v-list-item-content.break(v-html="illust.caption")
        v-list-item
          v-list-item-icon: v-icon mdi-calendar
          v-list-item-content {{ time }}
        v-list-item
          v-list-item-icon: v-icon mdi-tag
          v-list-item-content: v-chip-group.mw-100(column)
            v-chip(v-for="(tag, index) in tags" :key="index" small).text-truncate {{ tag }}
</template>

<script>
import gallery from '../utils/gallery'
import time from '../utils/time'

export default {
  props: {
    illust: {
      type: Object,
      required: true
    },
    pswp: {
      type: Element,
      required: true
    }
  },
  data: () => ({
    observer: null,
    isIntersecting: false
  }),
  computed: {
    lazySrc() {
      if (this.isIntersecting) this.observer.disconnect()
      return this.isIntersecting
        ? this.illust.meta_pages.length
          ? this.illust.meta_pages[this.illust.cover || 0].image_urls.thumb
          : this.illust.image_urls.thumb
        : ''
    },
    time() {
      return time(this.illust.create_date, navigator).format('lll')
    },
    tags() {
      let tags = []
      this.illust.tags.forEach(tag => {
        if (tag.name.includes('/') && !tag.name.endsWith('/'))
          [...tag.name.split('/')].forEach(
            tag => !tags.includes(tag) && tags.push(tag)
          )
        else !tags.includes(tag.name) && tags.push(tag.name)
      })
      return tags
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(
      entries => (this.isIntersecting = entries[0].isIntersecting)
    )
    this.observer.observe(this.$refs.img.$el)
  },
  methods: {
    breakpoint(name) {
      return this.$vuetify.breakpoint.name === name
    },
    gallery
  }
}
</script>

<style lang="sass" scoped>
.zoom
  cursor: zoom-in

.pointer
  cursor: pointer

.break
  word-break: break-all

.mw-100
  max-width: 100%

.v-menu--inline
  display: none
</style>
