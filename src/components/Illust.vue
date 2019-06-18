<template lang="pug">
  v-flex(xs6 sm4 lg2)
    v-card(flat): v-img.grey.lighten-2(
      :class="{ loaded }"
      :src="lazySrc"
      :alt="illust.title"
      aspect-ratio="1"
      max-height="250"
      max-width="250"
      ref="img"
      @click="loaded && gallery(pswp, illust, illust.cover, $refs.img.$el.getBoundingClientRect())"
    )
      v-container.fill-height.pa-1: v-layout.align-end.ma-0(column)
        v-chip(v-if="illust.meta_pages.length" small)
          v-icon(left size="16") mdi-image-multiple
          .font-weight-bold {{ illust.meta_pages.length }}
        v-spacer
        v-icon(v-if="illust.favorite" color="red") mdi-heart

      template(#placeholder): v-layout(fill-height align-center justify-center ma-0)
        v-progress-circular(indeterminate color="grey lighten-5")

    .mt-1.font-weight-bold.hidden-xs-only {{ illust.title }}
</template>

<script>
import image from '../utils/image'
import gallery from '../utils/gallery'

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
    image,
    gallery
  }
}
</script>

<style lang="sass" scoped>
.loaded
  cursor: zoom-in

@media screen and (min-width: 600px)
  .loaded::before
    content: ""
    position: absolute
    height: 100%
    width: 100%
    background-color: rgba(0, 0, 0, .02)
</style>
