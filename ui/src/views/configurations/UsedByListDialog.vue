<script setup lang="ts">
import { PropType, ref } from 'vue'
import { MachineDetail } from '@/typed-graph'
import { IconSearch } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  usedBy: {
    type: Array as PropType<MachineDetail[]>,
    required: true,
  },
})

const { t, d } = useI18n()

const searchValue = ref('')
const dialog = ref(false)
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'machineName' },
  { title: 'Startup', value: 'startupTime' },
  { title: 'Miners', value: 'miners' },
]
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-height="800"
    max-width="800"
  >
    <template #activator="{ props: p }">
      <v-btn
        v-bind="p"
        color="success"
        :readonly="usedBy.length === 0"
        variant="text"
        @click="dialog = true"
      >
        {{ props.usedBy.length }}
      </v-btn> {{ t('fields.Node', props.usedBy.length) }}
    </template>
    <template #default="{ }">
      <v-data-table-virtual
        fixed-header
        :headers="headers"
        hover
        :items="usedBy"
        :search="searchValue"
      >
        <template #top>
          <v-text-field
            v-model="searchValue"
            hide-details
            persistent-placeholder
            placeholder="Search"
            type="text"
            variant="outlined"
          >
            <template #prepend-inner>
              <IconSearch :size="14" />
            </template>
          </v-text-field>
        </template>
        <template #item.startupTime="{ value }">
          {{ d(value, 'short') }}
        </template>
      </v-data-table-virtual>
    </template>
  </v-dialog>
</template>

<style scoped lang="scss">

</style>
