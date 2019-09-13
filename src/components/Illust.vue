<template>
  <v-flex xs6 sm4 lg2>
    <v-card
      flat
      :tile="breakpoint('xs')"
      @click="
        gallery(illust, illust.cover, $refs.img.$el.getBoundingClientRect())
      "
    >
      <LazyImg
        class="cur-zoom-in"
        :src="src"
        :alt="illust.title"
        max-height="250"
        max-width="250"
        ref="img"
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
      </LazyImg>
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
              {{ date }}
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
import LazyImg from './LazyImg'
import gallery from '../utils/gallery'
import time from '../utils/time'

export default {
  props: {
    illust: {
      type: Object,
      required: true
    }
  },
  components: { LazyImg },
  setup(props, { root }) {
    const src = props.illust.meta_pages.length
      ? props.illust.meta_pages[props.illust.cover || 0].image_urls.thumb
      : props.illust.image_urls.thumb

    // Remove duplicate tags (https://stackoverflow.com/a/9229821)
    const tags = [...new Set(props.illust.tags.map(tag => tag.name))]

    const date = time(props.illust.create_date).format('lll')

    const breakpoint = name => root.$vuetify.breakpoint.name === name

    return {
      src,
      tags,
      date,
      breakpoint,
      gallery
    }
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
