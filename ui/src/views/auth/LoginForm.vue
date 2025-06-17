<script setup lang="ts">
import { ref } from 'vue'
import { IconEyeOff, IconEye } from '@tabler/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const username = ref('')
const password = ref('')
const show1 = ref(false)
const authError = ref('')
const authStore = useAuthStore()

function submit () {
  authStore.login(username.value, password.value).then(() => {
    authError.value = ''
  }).catch(error => {
    authError.value = error
  })
}

</script>

<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">
      {{ t('fields.Login') }}
    </h3>
  </div>
  <v-form
    class="mt-7 loginForm"
    @submit.prevent="submit"
  >
    <div class="mb-6">
      <v-label>{{ t('fields.Username') }}</v-label>
      <v-text-field
        v-model="username"
        aria-label="username"
        class="mt-2"
        color="primary"
        hide-details="auto"
        required
        variant="outlined"
      />
    </div>
    <div>
      <v-label>{{ t('fields.Password') }}</v-label>
      <v-text-field
        v-model="password"
        aria-label="password"
        class="mt-2"
        color="primary"
        hide-details="auto"
        required
        :type="show1 ? 'text' : 'password'"
        variant="outlined"
      >
        <template #append-inner>
          <v-btn
            color="secondary"
            icon
            rounded
            variant="text"
          >
            <IconEyeOff
              v-if="!show1"
              color="rgb(var(--v-theme-secondary))"
              @click="show1 = !show1"
            />
            <IconEye
              v-if="show1"
              color="rgb(var(--v-theme-secondary))"
              @click="show1 = !show1"
            />
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <v-btn
      block
      class="mt-5"
      color="primary"
      size="large"
      type="submit"
      variant="flat"
    >
      Login
    </v-btn>
    <div
      v-if="authError"
      class="mt-2"
    >
      <v-alert color="error">
        {{ authError }}
      </v-alert>
    </div>
  </v-form>
</template>

<style scoped lang="scss">

</style>
