<template lang="pug">
  v-app-bar(app)
    v-toolbar-title {{ config.title }}
    v-spacer
    v-tooltip(v-for="link in config.links" :key="link.title" bottom attach="#app")
      template(#activator="{ on }"): v-btn(
        v-on="on"
        :href="link.href"
        target="_blank"
        rel="noreferrer noopener"
        icon
      ): v-icon {{ link.icon }}
      span {{ link.title }}
</template>

<script>
import config from '../config'

export default {
  data: () => ({
    config
  })
}
</script>
