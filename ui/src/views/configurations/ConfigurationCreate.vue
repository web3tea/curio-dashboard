<script setup lang="ts">

import { Codemirror } from 'vue-codemirror'
import { computed, ref } from 'vue'
import { StreamLanguage } from '@codemirror/language'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { oneDark } from '@codemirror/theme-one-dark'
import { useMutation } from '@vue/apollo-composable'
import { CreateConfig, GetConfigs } from '@/gql/config'
import { useCustomizerStore } from '@/stores/customizer'
import { useRouter } from 'vue-router'
import { IconDeviceFloppy } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
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
  uiStore.appendMsg({
    type: 'success',
    msg: 'Configuration created successfully',
  })
  router.push({ name: 'Configurations' })
})

const breadcrumbs = ref([
  {
    title: 'Configurations',
    disabled: false,
    to: { name: 'Configurations' }
  }
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
        :loading="loading"
        @click="createConfig"
      >
        <template #prepend>
          <IconDeviceFloppy />
        </template>
        Create
      </v-btn>
    </template>
    <v-label class="mb-1">
      Layer
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
      Config
    </v-label>
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
