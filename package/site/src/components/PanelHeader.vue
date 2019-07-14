<template>
  <v-expansion-panel-header>
    <div>
      <v-avatar class="cur-help" @click.stop="showMemberInfo">
        <LazyImg
          :src="member.user.profile_image_urls.small"
          :alt="member.user.title"
        />
      </v-avatar>
      <v-menu v-model="menu" :position-x="x" :position-y="y">
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
import { value } from 'vue-function-api'
import ky from 'ky'
import LazyImg from './LazyImg'

export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  components: { LazyImg },
  setup(props) {
    const menu = value(false)
    const x = value(null)
    const y = value(null)

    const memberInfo = value(null)

    const showMemberInfo = async e => {
      menu.value = true
      x.value = e.clientX
      y.value = e.clientY

      if (!memberInfo.value)
        memberInfo.value = await ky('/api/', {
          searchParams: { type: 'member', id: props.member.user.id }
        }).json()
    }

    return {
      menu,
      x,
      y,
      memberInfo,
      showMemberInfo
    }
  }
}
</script>
