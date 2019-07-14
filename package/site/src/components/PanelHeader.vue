<template>
  <v-expansion-panel-header>
    <div>
      <v-menu offset-y :offset-overflow="true" ref="img">
        <template #activator="{ on }">
          <v-avatar class="cur-help">
            <v-img
              class="grey lighten-2"
              v-on="on"
              :src="lazySrc"
              :alt="member.user.title"
              aspect-ratio="1"
              @click.stop="!memberInfo && loadMemberInfo()"
            >
              <template #placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <v-card
          min-width="200"
          min-height="150"
          max-width="300"
          max-height="400"
        >
          <v-list v-if="memberInfo">
            <v-list-item>
              <v-list-item-avatar>
                <img
                  :src="memberInfo.user.profile_image_urls.small"
                  :alt="memberInfo.user.title"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ memberInfo.user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    memberInfo.profile.total_illusts +
                      memberInfo.profile.total_manga
                  }}
                  works
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action v-if="memberInfo.profile.webpage">
                <v-btn
                  :href="memberInfo.profile.webpage"
                  target="_blank"
                  rel="noreferrer noopener"
                  icon
                >
                  <v-icon>mdi-home</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn
                  :href="
                    `https://www.pixiv.net/member.php?id=${memberInfo.user.id}`
                  "
                  target="_blank"
                  rel="noreferrer noopener"
                  icon
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="memberInfo.user.comment">
              <v-list-item-icon>
                <v-icon>mdi-information</v-icon>
              </v-list-item-icon>
              <v-list-item-content
                v-html="memberInfo.user.comment.replace(/\\n/g, '<br>')"
              />
            </v-list-item>
            <v-list-item v-if="memberInfo.profile.twitter_account">
              <v-list-item-icon>
                <v-icon>mdi-twitter</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <a
                  :href="memberInfo.profile.twitter_url"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  @{{ memberInfo.profile.twitter_account }}
                </a>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-fade-transition>
            <v-overlay v-if="!memberInfo">
              <v-progress-circular indeterminate />
            </v-overlay>
          </v-fade-transition>
        </v-card>
      </v-menu>
    </div>

    <span class="title">{{ member.user.name }}</span>
  </v-expansion-panel-header>
</template>

<script>
import { value, computed, onMounted } from 'vue-function-api'
import ky from 'ky'

export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  setup(props, context) {
    // Lazy load
    const isIntersecting = value(false)
    const observer = new IntersectionObserver(
      entries => (isIntersecting.value = entries[0].isIntersecting)
    )
    const lazySrc = computed(() => {
      if (isIntersecting.value) observer.disconnect()
      return isIntersecting.value
        ? props.member.user.profile_image_urls.small
        : ''
    })
    onMounted(() => observer.observe(context.refs.img.$el))

    const memberInfo = value(null)
    const loadMemberInfo = async () =>
      (memberInfo.value = await ky('/api/', {
        searchParams: { type: 'member', id: props.member.user.id }
      }).json())

    return {
      lazySrc,
      memberInfo,
      loadMemberInfo
    }
  }
}
</script>
