<template lang="pug">
  v-dialog(v-model="dialog.show" max-width="300"): v-card
    v-card-title {{ dialog.illust.title  }}

    v-list
      v-list-item(v-if="dialog.illust.user")
        v-tooltip(bottom)
          template(#activator="{ on }"): v-list-item-avatar: v-btn(
            v-on="on"
            :href="`https://www.pixiv.net/member.php?id=${dialog.illust.user.id}`"
            target="_blank"
            rel="noreferrer noopener"
            icon
          ): v-icon mdi-brush

          span View member on pixiv

        v-list-item-content {{ dialog.illust.user.name }}

      v-list-item(v-if="dialog.illust.created_time")
        v-list-item-avatar: v-icon mdi-calendar-blank-outline
        v-list-item-content {{ dialog.illust.created_time.substring(0, 16) }}

      v-list-item
        v-tooltip(bottom)
          template(#activator="{ on }"): v-list-item-avatar: v-btn(
            v-on="on"
            :href="`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${dialog.illust.id}`"
            target="_blank"
            rel="noreferrer noopener"
            icon
          ): v-icon mdi-message-text

          span View illust on pixiv

        v-list-item-content {{ dialog.illust.caption }}
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      required: true
    }
  }
}
</script>
