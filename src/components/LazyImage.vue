<template lang="pug">
  v-tooltip(v-if="type === 'illust'" bottom)
    template(#activator="{ on }"): v-card(flat): v-img.pointer.grey.lighten-2(
      v-on="on"
      :src="src"
      :alt="alt"
      aspect-ratio="1"
      max-height="250"
      max-width="250"
      ref="img"
    ): template(#placeholder): v-layout(fill-height align-center justify-center ma-0)
      v-progress-circular(indeterminate color="grey lighten-5")

    span Open in gallery

  v-avatar(v-else-if="type === 'avatar'"): img(:src="src" :alt="alt" ref="img")
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'illust'
    },
    lazySrc: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  },
  data: () => ({
    observer: null,
    src: ''
  }),
  mounted() {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.observer.disconnect()
        this.src = this.lazySrc
      }
    })
    const img = this.$refs.img
    this.observer.observe(img.tagName === 'IMG' ? img : img.$el)
  }
}
</script>
