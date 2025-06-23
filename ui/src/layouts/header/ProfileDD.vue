<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

import { IconLogout, IconSettings } from '@tabler/icons-vue'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <div class="d-flex align-center pa-5">
      <v-avatar
        class="mr-2"
        size="32"
      >
        <img
          alt="Julia"
          src="@/assets/images/users/avatar.png"
          width="32"
        >
      </v-avatar>
      <div>
        <h6 class="text-h6 mb-0">
          {{ authStore.user?.username || 'User' }}
        </h6>
        <p class="text-caption mb-0">
          {{ authStore.user?.description || 'No Description' }}
        </p>
      </div>
    </div>
    <v-spacer />
    <v-list>
      <v-list-item
        color="primary"
        rounded="0"
        :to="{ name: 'Settings' }"
      >
        <template #prepend>
          <IconSettings
            class="mr-4"
            :size="18"
          />
        </template>
        <v-list-item-title class="text-h6">
          Settings
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        color="primary"
        rounded="0"
        @click="authStore.logout"
      >
        <template #prepend>
          <IconLogout
            class="mr-4"
            :size="18"
          />
        </template>
        <v-list-item-title class="text-h6">
          Logout
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>
