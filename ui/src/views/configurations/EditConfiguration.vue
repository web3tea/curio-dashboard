<script setup lang="ts">

import { Codemirror } from 'vue-codemirror'
import { computed, ref } from 'vue'
import { StreamLanguage } from '@codemirror/language'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { oneDark } from '@codemirror/theme-one-dark'
import { mdiClose } from '@mdi/js'
import { useMutation } from '@vue/apollo-composable'
import { CreateConfig, UpdateConfig } from '@/views/query/config'
import { useCustomizerStore } from '@/stores/customizer'

const props = defineProps({
  isCreate: Boolean,
  title: {
    type: String,
    required: true,
  },
  config: String,
})

const customizer = useCustomizerStore()

const extensions = computed(() => {
  if (customizer.dark) {
    return [StreamLanguage.define(toml), oneDark]
  }
  return [StreamLanguage.define(toml)]
})

const editConfig = ref(props.config)
const saveLoading = ref(false)

const { mutate: updateConfig } = useMutation(UpdateConfig)
const { mutate: createConfig } = useMutation(CreateConfig)

function saveEdit () {
  saveLoading.value = true
  if (props.isCreate) {
    createConfig({
      title: props.title,
      config: editConfig.value,
    }).then(() => {
      saveLoading.value = false
    })
  } else {
    updateConfig({
      title: props.title,
      config: editConfig.value,
    }).then(() => {
      saveLoading.value = false
    })
  }
}

</script>

<template>
  <v-card>
    <v-toolbar>
      <v-btn
        icon="true"
      ><v-icon :icon="mdiClose" /></v-btn>
      <v-toolbar-title>{{ props.title }}</v-toolbar-title>
      <v-spacer />

      <v-toolbar-items>
        <v-btn
          :loading="saveLoading"
          variant="text"
          @click="saveEdit"
        >
          Save
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <Codemirror
        v-model="editConfig"
        :autofocus="true"
        :extensions="extensions"
        :indent-with-tab="true"
        :tab-size="2"
      />
    </v-card-text>
  </v-card>

</template>

<style scoped lang="scss">

</style>
