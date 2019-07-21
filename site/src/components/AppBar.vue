<template>
  <v-app-bar app>
    <v-toolbar-title>
      {{ config.title }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip bottom attach="#app">
      <template #activator="{ on }">
        <v-btn v-on="on" @click="toggleDarkTheme" icon>
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </template>

      <span>Toggle Dark Theme</span>
    </v-tooltip>
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
  setup(props, context) {
    const vuetify = context.root.$vuetify
    const toggleDarkTheme = () => (vuetify.theme.dark = !vuetify.theme.dark)

    return {
      config,
      toggleDarkTheme
    }
  }
}
</script>
