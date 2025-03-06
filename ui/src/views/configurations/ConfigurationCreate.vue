<script setup lang="ts">

import {  ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CreateConfig, GetConfigs } from '@/gql/config'
import { useRouter } from 'vue-router'
import { IconDeviceFloppy } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { t } = useI18n()
const router = useRouter()

const editConfig = ref('')
const editTitle = ref('')

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

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <UiParentCard :title="t('fields.Create Configuration')">
    <template #action>
      <v-btn
        color="primary"
        :loading="loading"
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
    <v-label class="mb-1 mt-5">
      {{ t('fields.Config') }}
    </v-label>
    <TomlEditor
      v-model="editConfig"
    />
  </uiparentcard>
</template>

<style scoped lang="scss">

</style>
