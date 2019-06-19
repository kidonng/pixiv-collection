<template lang="pug">
  v-expansion-panel-header
    div: v-avatar: v-img.grey.lighten-2(
      :src="lazySrc"
      :alt="member.title"
      aspect-ratio="1"
      ref="img"
    ): template(#placeholder): v-layout(fill-height align-center justify-center ma-0)
        v-progress-circular(indeterminate color="grey lighten-5")
    .title {{ member.name }}
</template>

<script>
export default {
  props: {
    member: {
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
      return this.isIntersecting ? this.member.profile_image_urls.small : ''
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(
      entries => (this.isIntersecting = entries[0].isIntersecting)
    )
    this.observer.observe(this.$refs.img.$el)
  }
}
</script>
