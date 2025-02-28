<script setup lang="ts">
import { PropType, ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useMutation } from '@vue/apollo-composable'
import { RestartSector } from '@/gql/sector'
import { IconRotateDot } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

interface Sector {
  spId: string,
  sectorNumber: number,
}

const { t } = useI18n()

const props = defineProps({
  sectors: {
    type: Array as PropType<Sector[]>,
    required: true,
  },
  useIcon: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: undefined,
  },
  size: {
    type: String,
    default: undefined,
  },
})

const uiStore = useUIStore()
const { mutate, loading } = useMutation(RestartSector)

async function doRestart () {
  const success = ref(0)
  await Promise.all(props.sectors?.map(sector => mutate({
    miner: sector.spId,
    sectorNumber: sector.sectorNumber,
  }).then(() => {
    success.value++
  })))
  uiStore.appendMsg({
    type: 'success',
    msg: `Restarting ${success.value} sectors`,
  })
}

</script>

<template>
  <v-icon
    v-if="useIcon"
    class="ms-3"
    :color="props.color"
    :icon="IconRotateDot"
    :size="props.size"
    @click="doRestart"
  />
  <v-btn
    v-else
    class="ms-3"
    :color="props.color"
    :loading="loading"
    :prepend-icon="IconRotateDot"
    :size="props.size"
    variant="flat"
    @click="doRestart"
  >
    {{ t('actions.Restart') }} ({{ props.sectors.length }})
  </v-btn>
</template>

<style scoped lang="scss">

</style>
