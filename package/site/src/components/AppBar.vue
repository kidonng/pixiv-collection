<template>
  <v-app-bar app>
    <v-toolbar-title>
      {{ config.title }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip
      v-for="link in config.links"
      :key="link.title"
      bottom
      attach="#app"
    >
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :href="link.href"
          target="_blank"
          rel="noreferrer noopener"
          icon
        >
          <v-icon>{{ link.icon }}</v-icon>
        </v-btn>
      </template>

      <span>{{ link.title }}</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
import config from '../../config'

export default {
  data: () => ({
    config
  })
}
</script>
