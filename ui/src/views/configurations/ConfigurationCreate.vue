<script setup lang="ts">

import { Codemirror } from 'vue-codemirror'
import { computed, ref } from 'vue'
import { StreamLanguage } from '@codemirror/language'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { oneDark } from '@codemirror/theme-one-dark'
import { useMutation } from '@vue/apollo-composable'
import { CreateConfig } from '@/views/query/config'
import { useCustomizerStore } from '@/stores/customizer'

const editConfig = ref('')
const editTitle = ref('')
const saveLoading = ref(false)

const { mutate: createConfig, error } = useMutation(CreateConfig)

function saveEdit () {
  saveLoading.value = true
  createConfig({
    title: editTitle.value,
    config: editConfig.value,
  }).then(() => {
  }).finally(() => {
    saveLoading.value = false
  })
}

const breadcrumbs = ref([
  {
    title: 'Configurations',
    disabled: false,
    href: '/app/configurations',
  },
  {
    title: 'Create',
    disabled: true,
    href: '#',
  },
])

const customizer = useCustomizerStore()

const extensions = computed(() => {
  if (customizer.dark) {
    return [StreamLanguage.define(toml), oneDark]
  }
  return [StreamLanguage.define(toml)]
})
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Create Configuration">
    <template #action>
      <v-btn
        color="primary"
        :loading="saveLoading"
        @click="saveEdit"
      >
        <template #append>
          <DeviceFloppyIcon />
        </template>
        Save
      </v-btn>
    </template>
    <v-label class="mb-1">Layer</v-label>
    <v-text-field
      v-model="editTitle"
      color="primary"
      :error-messages="error?.message"
      persistent-hint
      persistent-placeholder
      placeholder="Enter config layer"
      variant="outlined"
    />
    <v-label class="mb-1 mt-5">Config</v-label>
    <Codemirror
      v-model="editConfig"
      :autofocus="true"
      :extensions="extensions"
      :indent-with-tab="true"
      :style="{ height: '700px' }"
      :tab-size="2"
    />
  </uiparentcard>
</template>

<style scoped lang="scss">

</style>
