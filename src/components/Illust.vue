<template>
  <v-flex xs6 sm4 lg2>
    <v-card flat :tile="breakpoint('xs')">
      <v-img
        class="grey lighten-2 cur-zoom-in"
        :src="lazySrc"
        :alt="illust.title"
        aspect-ratio="1"
        max-height="250"
        max-width="250"
        ref="img"
        @click="
          gallery(illust, illust.cover, $refs.img.$el.getBoundingClientRect())
        "
      >
        <v-container class="fill-height pa-1">
          <v-layout class="align-end ma-0" column>
            <v-chip v-if="illust.meta_pages.length > 1" small>
              <v-icon left size="16">mdi-image-multiple</v-icon>
              <div class="font-weight-bold">
                {{ illust.meta_pages.length }}
              </div>
            </v-chip>
            <v-spacer />
            <v-icon v-if="illust.favorite" color="red">mdi-heart</v-icon>
          </v-layout>
        </v-container>

        <template #placeholder>
          <v-layout fill-height align-center justify-center ma-0>
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-layout>
        </template>
      </v-img>
    </v-card>

    <v-menu offset-y :offset-overflow="true">
      <template #activator="{ on }">
        <div
          class="mt-1 font-weight-bold cur-help"
          :class="{ 'my-2 ml-2': breakpoint('xs') }"
          v-on="on"
        >
          {{ illust.title }}
        </div>
      </template>

      <v-card max-width="300" max-height="400">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ illust.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ illust.user.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :href="
                  `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`
                "
                target="_blank"
                rel="noreferrer noopener"
                icon
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-if="illust.caption">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="break-all" v-html="illust.caption" />
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ time }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-tag</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-chip-group class="max-width-100" column>
                <v-chip
                  v-for="tag in tags"
                  :key="tag"
                  :title="tag"
                  class="text-truncate"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-flex>
</template>

<script>
import gallery from '../utils/gallery'
import time from '../utils/time'

export default {
  props: {
    illust: {
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
      return this.isIntersecting
        ? this.illust.meta_pages.length
          ? this.illust.meta_pages[this.illust.cover || 0].image_urls.thumb
          : this.illust.image_urls.thumb
        : ''
    },
    time() {
      return time(this.illust.create_date, navigator).format('lll')
    },
    tags() {
      // Remove duplicate (https://stackoverflow.com/a/9229821)
      return [...new Set(this.illust.tags.map(tag => tag.name))]
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(
      entries => (this.isIntersecting = entries[0].isIntersecting)
    )
    this.observer.observe(this.$refs.img.$el)
  },
  methods: {
    breakpoint(name) {
      return this.$vuetify.breakpoint.name === name
    },
    gallery
  }
}
</script>

<style lang="sass" scoped>
.break-all
  word-break: break-all

.max-width-100
  max-width: 100%

.v-menu--inline
  display: none
</style>
