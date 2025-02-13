<script setup lang="ts">

import { GetMinerPower } from '@/gql/miner'
import { computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { MinerPower } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconUsers } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  miner: {
    type: String,
    default: undefined
  },
})

const { t } = useI18n()

const { result } = useQuery(GetMinerPower, {
  miner: props.miner,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const minerPower: ComputedRef<MinerPower> = computed(() => result.value?.minerPower || {})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h5 class="text-h5">
              {{ t('fields.Total Power') }}
            </h5>
            <h3 class="text-h3 my-2">
              {{ formatBytes(minerPower.minerPower?.qualityAdjPower).combined }}
            </h3>
            <h6 class="text-caption font-weight-medium mb-0">
              {{ t('fields.Raw Byte Power') }}: {{ formatBytes(minerPower.minerPower?.rawBytePower).combined }}
            </h6>
          </div>
          <span class="d-flex align-center">
            <v-btn
              :icon="IconUsers"
              rounded="md"
              size="small"
              :to="{ name: 'Miners' }"
              variant="flat"
            />
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
