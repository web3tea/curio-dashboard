<script setup lang="ts">

import {  ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CreateConfig, GetConfigs } from '@/gql/config'
import { useRouter } from 'vue-router'
import { IconDeviceFloppy, IconSettingsCheck } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { t } = useI18n()
const router = useRouter()

const editConfig = ref('')
const editTitle = ref('')
const isValid = ref(false)

const { mutate: createConfig, loading, onDone, error } = useMutation(CreateConfig, () => ({
  variables: {
    title: editTitle.value,
    config: editConfig.value,
  },
  refetchQueries: [{
    query: GetConfigs,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  notificationStore.success('Configuration created successfully')
  router.push({ name: 'Configurations' })
})

const breadcrumbs = ref([
  {
    title: t('nav.Configurations'),
    disabled: false,
    to: { name: 'Configurations' }
  }
])

function handleIsValid(v: boolean) {
  console.log('Config is valid:', v)
  isValid.value = v
}

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <UiParentCard :title="t('fields.Create Configuration')">
    <template #action>
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!isValid"
        @click="createConfig"
      >
        <template #prepend>
          <IconDeviceFloppy />
        </template>
        {{ t('actions.Create') }}
      </v-btn>
    </template>
    <v-label class="mb-1">
      {{ t('fields.Layer') }}
    </v-label>
    <v-text-field
      v-model="editTitle"
      color="primary"
      :error-messages="error?.message"
      persistent-hint
      persistent-placeholder
      placeholder="Enter config layer"
      variant="outlined"
    />
    <v-label class="mb-1 mt-5 mr-5">
      {{ t('fields.Content') }}
    </v-label>
    <a
      href="https://docs.curiostorage.org/configuration/default-curio-configuration"
      target="_blank"
      class="text-decoration-none"
    >
      <v-icon
        :icon="IconSettingsCheck"
        size="small"
      />
      Check the default configuration
    </a>
    <ConfigEditor
      v-model="editConfig"
      @is-valid="handleIsValid"
    />
  </uiparentcard>
</template>

<style scoped lang="scss">

</style>
