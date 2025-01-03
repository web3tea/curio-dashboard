<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

import { IconLogout } from '@tabler/icons-vue'

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
          src="@/assets/images/users/avatar-1.png"
          width="32"
        >
      </v-avatar>
      <div>
        <h6 class="text-h6 mb-0">
          Lee
        </h6>
        <p class="text-caption mb-0">
          Software Developer
        </p>
      </div>
      <div class="ml-auto">
        <v-btn
          color="primary"
          :icon="IconLogout"
          rounded="sm"
          size="large"
          variant="text"
          @click="authStore.logout"
        />
      </div>
    </div>
  </div>
</template>
