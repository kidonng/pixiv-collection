<template lang="pug">
  v-img.illust.grey.lighten-2(
    v-if="type === 'illust'"
    :src="src"
    :alt="alt"
    title="Open in gallery"
    aspect-ratio="1"
    max-height="250"
    max-width="250"
    ref="img"
  ): template(#placeholder)
    v-layout(fill-height align-center justify-center ma-0)
      v-progress-circular(indeterminate color="grey lighten-5")
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

<style lang="stylus" scoped>
.illust
  cursor pointer
  border-radius 4px
</style>
