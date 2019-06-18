<template lang="pug">
  v-card(flat): v-img.illust.grey.lighten-2(
    :class="{ loaded }"
    :src="lazySrc"
    :alt="illust.title"
    aspect-ratio="1"
    max-height="250"
    max-width="250"
    ref="img"
  )
    v-container.fill-height.pa-1: v-layout.align-end.ma-0(column)
      v-chip(v-if="illust.meta_pages.length" small)
        v-icon(left size="16") mdi-image-multiple
        .font-weight-bold {{ illust.meta_pages.length }}
      v-spacer
      v-icon(v-if="illust.favorite" color="red") mdi-heart
    template(#placeholder): v-layout(fill-height align-center justify-center ma-0)
      v-progress-circular(indeterminate color="grey lighten-5")
</template>

<script>
import image from '../utils/image'

export default {
  props: {
    illust: {
      type: Object,
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
        ? this.image(
            this.illust.meta_pages.length
              ? this.illust.meta_pages[this.illust.cover || 0].image_urls
                  .original
              : this.illust.meta_single_page.original_image_url
          ).small_2
        : ''
    },
    loaded() {
      return this.illust.meta_pages.every(page => page.width)
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(
      entries => (this.isIntersecting = entries[0].isIntersecting)
    )
    this.observer.observe(this.$refs.img.$el)
  },
  methods: {
    image
  }
}
</script>

<style lang="sass" scoped>
.loaded
  cursor: pointer

@media screen and (min-width: 600px)
  .illust::before
    content: ""
    position: absolute
    height: 100%
    width: 100%
    background-color: rgba(0, 0, 0, .02)
</style>
