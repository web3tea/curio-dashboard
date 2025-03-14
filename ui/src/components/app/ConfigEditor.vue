<script setup lang="ts">
import { computed } from 'vue'
import CodeMirror from 'vue-codemirror6'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { StreamLanguage } from '@codemirror/language'
import { useCustomizerStore } from '@/stores/customizer'
import { oneDark } from '@codemirror/theme-one-dark'
import { tomlParseLinter } from '@/utils/helpers/tomlLinter'
import { diagnosticCount } from "@codemirror/lint"
import { ViewUpdate } from "@codemirror/view"

const emit = defineEmits(['update:model', 'isValid'])

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
const linter = tomlParseLinter()

const extensions = computed(() => {
  if (customizer.dark) {
    return [StreamLanguage.define(toml), oneDark]
  }
  return [StreamLanguage.define(toml)]
})

function handleUpdate (value: ViewUpdate) {
  const v = diagnosticCount(value.view.state)
  emit('isValid', v === 0)
}

</script>
<template>
  <CodeMirror
    v-model="localValue"
    :extensions="extensions"
    :linter="linter"
    basic
    tab
    gutter
    allow-multiple-selections
    force-linting
    :readonly="readonly"
    :disabled="readonly"
    placeholder="Input your config here"
    @update="handleUpdate"
  />
</template>
