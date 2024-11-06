<script setup lang="ts">

import { Codemirror } from 'vue-codemirror'
import { computed, ComputedRef, ref, watch } from 'vue'
import { StreamLanguage } from '@codemirror/language'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { oneDark } from '@codemirror/theme-one-dark'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GetConfig, UpdateConfig } from '@/views/query/config'
import { useCustomizerStore } from '@/stores/customizer'
import { Config } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import { IconDeviceFloppy, IconPencil } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const { t } = useI18n()

const props = defineProps({
  layer: {
    type: String,
    required: true,
  },
})

const enableEdit = ref(false)

const { result, error } = useQuery(GetConfig, {
  layer: props.layer,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const config: ComputedRef<Config> = computed(() => result.value?.config)

const editConfig = ref(config.value?.config)
const editTitle = ref(config.value?.title)

watch(result, () => {
  editConfig.value = config.value?.config
  editTitle.value = config.value?.title
})

const { mutate: updateConfig, loading, onDone } = useMutation(UpdateConfig)

function saveEdit () {
  updateConfig({
    title: editTitle.value,
    config: editConfig.value,
  })
}

onDone(() => {
  enableEdit.value = false
  uiStore.appendMsg({
    type: 'success',
    msg: `Configuration ${editTitle.value} updated successfully`,
  })
})

const breadcrumbs = ref([
  {
    title: 'Configurations',
    disabled: false,
    href: '/app/configurations',
  },
  {
    title: props.layer,
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
  <UiParentCard :title="t('fields.Edit Configuration')">
    <template #action>
      <v-btn
        v-if="enableEdit"
        color="primary"
        :loading="loading"
        @click="saveEdit"
      >
        <template #prepend>
          <IconDeviceFloppy />
        </template>
        {{ t('actions.Save') }}
      </v-btn>
      <v-btn
        v-else
        color="error"
        @click="enableEdit = true"
      >
        <template #prepend>
          <IconPencil />
        </template>
        {{ t('actions.Edit') }}
      </v-btn>
    </template>
    <v-label class="mb-1">Layer</v-label>
    <v-text-field
      v-model="editTitle"
      color="primary"
      :disabled="true"
      :error-messages="error?.message"
      persistent-hint
      persistent-placeholder
      placeholder="Enter config layer"
      required
      variant="outlined"
    />
    <v-label class="mb-1 mt-5">Config</v-label>
    <Codemirror
      v-model="editConfig"
      :autofocus="true"
      :disabled="!enableEdit"
      :extensions="extensions"
      :indent-with-tab="true"
      :style="{ height: '700px' }"
      :tab-size="2"
    />
  </uiparentcard>
</template>

<style scoped lang="scss">

</style>
