<script setup lang="ts">
import { ComputedRef , computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMarketPieceInfo } from '@/gql/piece'
import { MarketPieceMetadata } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { t, d } = useI18n()

const { result, loading, refetch } = useQuery(GetMarketPieceInfo, {
  id: props.id,
}, {})
const item: ComputedRef<MarketPieceMetadata> = computed(() => result.value?.marketPieceInfo.metadata || {})

</script>

<template>
  <UiChildCard
    :title="t('fields.Piece Metadata')"
    :loading="loading"
  >
    <template #action>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Piece ID
          </v-col>
          <v-col cols="9">
            {{ item }}
            <CopyIcon :value="item.pieceCid" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </UiChildCard>
</template>
