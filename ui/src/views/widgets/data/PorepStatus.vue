<script setup lang="ts">
import { PropType } from 'vue'
import { Porep } from '@/typed-graph'

defineProps({
  sector: {
    type: Object as PropType<Porep>,
    required: true,
  },
})

const stateMap = {
  afterSdr: { value: 18, label: 'SDR' },
  afterTreeD: { value: 10, label: 'TreeD' },
  afterTreeC: { value: 5, label: 'TreeC' },
  afterTreeR: { value: 5, label: 'TreeR' },
  afterSynth: { value: 10, label: 'Synthetic' },
  afterPrecommitMsg: { value: 5, label: 'Precommit Msg' },
  afterPrecommitMsgSuccess: { value: 5, label: 'Precommit Wait' },
  afterPorep: { value: 15, label: 'PoRep' },
  afterFinalize: { value: 5, label: 'Clear Cache' },
  afterCommitMsg: { value: 5, label: 'Commit Msg' },
  afterMoveStorage: { value: 5, label: 'Move Storage' },
  afterCommitMsgSuccess: { value: 5, label: 'Commit Wait' },
}

</script>
<template>
  <v-stepper alt-labels>
    <v-stepper-header>
      <template v-for="(item, i) in stateMap" :key="i">
        <v-divider v-if="i" />
        <v-stepper-item
          :rules="[() => sector[i]]"
          :value="i"
        >
          <template #title>
            {{ item.label }}
          </template>
        </v-stepper-item>
      </template>
    </v-stepper-header>
  </v-stepper>
</template>

<style scoped lang="scss">

</style>
