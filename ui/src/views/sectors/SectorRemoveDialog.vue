<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { RemoveSector } from '@/gql/sector'
import { IconAlertOctagon, IconTrash } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

interface Sector {
  spId: string,
  sectorNumber: number,
  failed: boolean
}

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
    default: 'error',
  },
  size: {
    type: String,
    default: undefined,
  },
})

const { t } = useI18n()

const success = ref(0)
const dialog = ref(false)
const doubleCheck = ref(false)
const hasHealthSector = computed(() => props.sectors.some(sector => !sector.failed))
const canRemove = computed(() => {
  if (hasHealthSector.value) {
    return doubleCheck.value
  } else {
    return true
  }
})

const { mutate, loading, onError, onDone } = useMutation(RemoveSector)

onError(e => {
  notificationStore.error(e.message)
})

onDone(() => {
  notificationStore.success(`Sector removed successfully`)
  dialog.value = false
})

function removeSector () {
  props.sectors?.forEach(sector => {
    mutate({
      miner: sector.spId,
      sectorNumber: sector.sectorNumber,
    }).then(() => {
      success.value++
    })
  })
}

</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <template #activator="{ props: p }">
      <v-icon
        v-if="useIcon"
        :color="props.color"
        v-bind="p"
        :icon="IconTrash"
        :size="props.size"
        @click="dialog = true"
      />
      <v-btn
        v-else
        v-bind="p"
        :color="props.color"
        :prepend-icon="IconTrash"
        :size="props.size"
        variant="flat"
        @click="dialog = true"
      >
        {{ t('actions.Remove') }} ({{ props.sectors.length }})
      </v-btn>
    </template>
    <template #default="{ }">
      <v-card
        border
        class="mx-auto"
        flat
        max-width="500"
      >
        <v-list-item
          class="px-6"
          height="88"
        >
          <template #append>
            <v-icon
              color="warning"
              :icon="IconAlertOctagon"
            />
          </template>
          <template #title>
            {{ t('msgs.sureRemoveSector', sectors.length) }}
          </template>
        </v-list-item>

        <v-divider />

        <v-card-text class="text-medium-emphasis pa-6">
          <div class="text-h6 mb-6">
            {{ t('msgs.actionCantUndo') }}
          </div>

          <template v-if="sectors.length > 1">
            <div class="text-h4 font-weight-black mb-4">
              {{ (success/sectors.length * 100).toFixed(0) }}%
            </div>

            <v-progress-linear
              bg-color="surface-variant"
              class="mb-6"
              color="primary"
              height="10"
              :max="sectors.length"
              :model-value="success"
              rounded="pill"
            />
            <div>Removed {{ success }} — Total {{ sectors.length }}</div>
          </template>
          <template v-else>
            <div class="my-4">
              Miner: <v-chip
                color="red"
                variant="outlined"
              >
                {{ sectors[0].spId }}
              </v-chip>
            </div>
            <div class="my-4">
              Sector: <v-chip
                color="red"
                variant="outlined"
              >
                {{ sectors[0].sectorNumber }}
              </v-chip>
            </div>
          </template>
          <v-row v-if="hasHealthSector">
            <v-col cols="auto">
              <div
                class="my-4  text-overline"
                style="color: yellow"
              >
                ({{ t('msgs.sectorNotFailed', props.sectors.length) }})
              </div>
            </v-col>
            <v-col cols="auto">
              <v-checkbox v-model="doubleCheck">
                <template #label>
                  {{
                    t('msgs.understand')
                  }}
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">
            {{ t('actions.Cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :disabled="!canRemove"
            :loading="loading"
            variant="flat"
            @click="removeSector"
          >
            {{ t('actions.Remove') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
