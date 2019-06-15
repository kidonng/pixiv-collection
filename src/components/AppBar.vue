<template lang="pug">
  v-app-bar(app dark)
    v-toolbar-title {{ config.title }}
    v-spacer
    v-tooltip(v-for="(link, index) in config.links" :key="index" bottom)
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
import config from '../../config'

export default {
  data: () => ({
    config
  })
}
</script>
