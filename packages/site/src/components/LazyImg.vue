<template>
  <v-img class="grey lighten-2" aspect-ratio="1" :src="lazySrc" ref="img">
    <slot />
    <template #placeholder>
      <v-layout fill-height align-center justify-center ma-0>
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-layout>
    </template>
  </v-img>
</template>

<script>
import { value, computed, onMounted } from 'vue-function-api'

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    const isIntersecting = value(false)
    const observer = new IntersectionObserver(
      entries => (isIntersecting.value = entries[0].isIntersecting)
    )
    const lazySrc = computed(() => {
      if (isIntersecting.value) observer.disconnect()
      return isIntersecting.value ? props.src : ''
    })
    onMounted(() => observer.observe(context.refs.img.$el))

    return { lazySrc }
  }
}
</script>
