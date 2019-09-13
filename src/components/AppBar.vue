<template>
  <v-app-bar app>
    <v-toolbar-title>
      {{ title }}
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
    <v-tooltip bottom attach="#app">
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          href="https://github.com/kidonng/pixiv-collection"
          icon
        >
          <v-icon>mdi-github-circle</v-icon>
        </v-btn>
      </template>

      <span>GitHub</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
import { title } from '../config'

export default {
  setup(props, { root }) {
    const theme = root.$vuetify.theme
    const toggleDarkTheme = () => (theme.dark = !theme.dark)

    return {
      title,
      toggleDarkTheme
    }
  }
}
</script>
