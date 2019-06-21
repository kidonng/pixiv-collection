<template lang="pug">
  v-expansion-panel-header
    div: v-menu(v-model="menu" ref="avatar")
      template(#activator="{}"): v-avatar: v-img.grey.lighten-2(
        :src="lazySrc"
        :alt="member.user.title"
        aspect-ratio="1"
        @click.stop="showMemberInfo"
      ): template(#placeholder): v-layout(fill-height align-center justify-center ma-0)
        v-progress-circular(indeterminate color="grey lighten-5")

      v-card(min-width="200" min-height="150" max-width="300" max-height="400")
        v-list(v-if="memberInfo")
          v-list-item
            v-list-item-avatar: img(:src="memberInfo.user.profile_image_urls.small")
            v-list-item-content
              v-list-item-title {{ memberInfo.user.name }}
              v-list-item-subtitle(v-if="memberInfo.profile.region") {{ memberInfo.profile.region }}
            v-list-item-action(v-if="memberInfo.profile.webpage")
              v-btn(
                :href="memberInfo.profile.webpage"
                target="_blank"
                rel="noreferrer noopener"
                icon
              ): v-icon mdi-home
            v-list-item-action
              v-btn(
                :href="`https://www.pixiv.net/member.php?id=${memberInfo.user.id}`"
                target="_blank"
                rel="noreferrer noopener"
                icon
              ): v-icon mdi-open-in-new
          v-list-item(v-if="memberInfo.user.comment")
            v-list-item-icon: v-icon mdi-information
            v-list-item-content(v-html="memberInfo.user.comment.replace(/\\n/g, '<br>')")
          v-list-item(v-if="memberInfo.profile.twitter_account")
            v-list-item-icon: v-icon mdi-twitter
            v-list-item-content: a(
              :href="memberInfo.profile.twitter_url"
              target="_blank"
              rel="noreferrer noopener"
            ) @{{ memberInfo.profile.twitter_account }}

        v-fade-transition: v-overlay(v-if="!memberInfo"): v-progress-circular(indeterminate)

    .title {{ member.user.name }}
</template>

<script>
import ky from 'ky'

export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    observer: null,
    isIntersecting: false,
    menu: false,
    memberInfo: null
  }),
  computed: {
    lazySrc() {
      if (this.isIntersecting) this.observer.disconnect()
      return this.isIntersecting
        ? this.member.user.profile_image_urls.small
        : ''
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(
      entries => (this.isIntersecting = entries[0].isIntersecting)
    )
    this.observer.observe(this.$refs.avatar.$el)
  },
  methods: {
    async showMemberInfo() {
      this.menu = true

      if (!this.memberInfo)
        this.memberInfo = await ky('/api/pixiv/', {
          searchParams: { type: 'member', id: this.member.user.id }
        }).json()
    }
  }
}
</script>
