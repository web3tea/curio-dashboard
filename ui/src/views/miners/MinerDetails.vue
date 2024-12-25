<script setup lang="ts">

import { ref } from 'vue'
import MinerInfo from "@/views/miners/MinerInfo.vue"
import TabCard from "@/views/mining/overview/TabCard.vue"
import { IconInfoCircle, IconMoneybag } from "@tabler/icons-vue"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const breadcrumbs = ref([
  {
    title: 'Miners',
    disabled: false,
    href: '/app/miners',
  },
  {
    title: props.id,
    disabled: true,
    href: '#',
  },
])

const tab = ref('tab-profile')

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <v-card variant="flat">
        <v-card variant="outlined">
          <v-card-text>
            <v-tabs v-model="tab" color="primary">
              <v-tab value="tab-profile"><IconInfoCircle class="v-icon--start" size="18" />Profile</v-tab>
              <v-tab value="tab-mining"><IconMoneybag class="v-icon--start" size="18" />Mining</v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <div class="pt-6">
              <v-window v-model="tab">
                <v-window-item value="tab-profile">
                  <MinerInfo :id="props.id" />
                </v-window-item>
                <v-window-item value="tab-mining">
                  <TabCard :miner="props.id" />
                </v-window-item>
              </v-window>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
