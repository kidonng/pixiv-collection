<template lang="pug">
  v-app-bar(app)
    v-toolbar-title {{ config.title }}
    v-spacer
    v-menu(offset-y)
      template(#activator="{ on }"): v-btn(v-on="on" icon): v-icon mdi-dots-vertical

      v-list: v-list-item(v-for="link in config.links" :key="link.title")
        v-list-item-icon: v-icon {{ link.icon }}
        v-list-item-content: v-btn(
          :href="link.href"
          target="_blank"
          rel="noreferrer noopener"
          text
        ) {{ link.title }}
</template>

<script>
import config from '../../config'

export default {
  data: () => ({
    config
  })
}
</script>
