<script setup lang="ts">
import { ref } from 'vue'
// icons
import { CloseOutlined, MailOutlined } from '@ant-design/icons-vue'

const MessageMenu = ref(false)
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu
    v-model="MessageMenu"
    :close-on-content-click="false"
    offset="6, 0"
  >
    <template #activator="{ props }">
      <v-btn
        class="text-secondary ml-sm-2 ml-1"
        color="darkText"
        icon
        rounded="sm"
        size="small"
        v-bind="props"
      >
        <MailOutlined :style="{ fontSize: '16px' }" />
      </v-btn>
    </template>
    <v-sheet
      class="notification-dropdown"
      rounded="md"
      width="395"
    >
      <div class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <h6 class="text-subtitle-1 mb-0">
            Message
          </h6>
          <v-btn
            color="primary"
            icon
            rounded
            size="small"
            variant="text"
            @click="MessageMenu = false"
          >
            <CloseOutlined :style="{ fontSize: '12px' }" />
          </v-btn>
        </div>
      </div>
      <v-divider />
      <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 267px">
        <v-list
          aria-busy="true"
          aria-label="message list"
          class="py-0"
          lines="two"
        >
          <v-list-item
            class="py-3"
            color="secondary"
            value="1"
          >
            <template #prepend>
              <v-avatar
                class="py-2"
                size="40"
              >
                <img
                  alt="user vector"
                  src="@/assets/images/users/avatar-2.png"
                  width="40"
                >
              </v-avatar>
            </template>
            <div class="d-inline-flex justify-space-between w-100">
              <h6 class="text-subtitle-1 font-weight-regular mb-0">
                It's <span style="font-weight: 600">Cristina danny's</span> birthday today.
              </h6>
              <span class="text-caption">3:00 AM</span>
            </div>

            <p class="text-caption text-medium-emphasis my-0">
              2 min ago
            </p>
          </v-list-item>
          <v-divider />
          <v-list-item
            class="py-3"
            color="secondary"
            value="2"
          >
            <template #prepend>
              <v-avatar
                class="py-2"
                size="40"
              >
                <img
                  alt="user vector"
                  src="@/assets/images/users/avatar-3.png"
                  width="40"
                >
              </v-avatar>
            </template>
            <div class="d-inline-flex justify-space-between w-100">
              <h6 class="text-subtitle-1 font-weight-regular mb-0">
                <span style="font-weight: 600">Aida Burg</span> commented your post.
              </h6>
              <span class="text-caption">6:00 PM</span>
            </div>

            <p class="text-caption text-medium-emphasis my-0">
              5 August
            </p>
          </v-list-item>
          <v-divider />
          <v-list-item
            class="py-3"
            color="secondary"
            value="3"
          >
            <template #prepend>
              <v-avatar
                class="py-2"
                size="40"
              >
                <img
                  alt="user vector"
                  src="@/assets/images/users/avatar-4.png"
                  width="40"
                >
              </v-avatar>
            </template>
            <div class="d-inline-flex justify-space-between w-100">
              <h6 class="text-subtitle-1 font-weight-regular mb-0">
                <span style="font-weight: 600">There was a failure to your setup.</span>
              </h6>
              <span class="text-caption">2:45 PM</span>
            </div>

            <p class="text-caption text-medium-emphasis my-0">
              7 hours ago
            </p>
          </v-list-item>
          <v-divider />
          <v-list-item
            class="py-3"
            color="secondary"
            value="4"
          >
            <template #prepend>
              <v-avatar
                class="py-2"
                size="40"
              >
                <img
                  alt="user vector"
                  src="@/assets/images/users/avatar-5.png"
                  width="40"
                >
              </v-avatar>
            </template>
            <div class="d-inline-flex justify-space-between w-100">
              <h6 class="text-subtitle-1 font-weight-regular mb-0">
                <span style="font-weight: 600">Cristina Danny</span> invited to join <span style="font-weight: 600">Metting.</span>
              </h6>
              <span class="text-caption">9:10 PM</span>
            </div>

            <p class="text-caption text-medium-emphasis my-0">
              Daily scrum meeting time
            </p>
          </v-list-item>
        </v-list>
      </perfect-scrollbar>
      <v-divider />
      <div class="pa-2 text-center">
        <v-btn
          color="primary"
          variant="text"
        >
          View All
        </v-btn>
      </div>
    </v-sheet>
  </v-menu>
</template>

<style lang="scss">
.v-tooltip {
  > .v-overlay__content.custom-tooltip {
    padding: 2px 6px;
  }
}
</style>
