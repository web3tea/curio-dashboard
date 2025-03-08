<script setup lang="ts">
import { computed } from 'vue'
import CodeMirror from 'vue-codemirror6'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { StreamLanguage } from '@codemirror/language'
import { useCustomizerStore } from '@/stores/customizer'
import { oneDark } from '@codemirror/theme-one-dark'

const emit = defineEmits(['update:model'])

const props = defineProps({
  model: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const localValue = computed({
  get () {
    return props.model
  },
  set (value) {
    emit('update:model', value)
  },
})
const customizer = useCustomizerStore()

const extensions = computed(() => {
  if (customizer.dark) {
    return [StreamLanguage.define(toml), oneDark]
  }
  return [StreamLanguage.define(toml)]
})

</script>
<template>
  <CodeMirror
    v-model="localValue"
    :extensions="extensions"
    basic
    tab
    allow-multiple-selections
    :readonly="readonly"
    :disabled="readonly"
    placeholder="Input your config here"
  />
</template>
