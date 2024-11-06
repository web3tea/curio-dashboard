<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { GetConfigs, RemoveConfig } from '@/views/query/config'
import { IconAlertOctagon, IconTrash } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'
const uiStore = useUIStore()

const props = defineProps({
  title: {
    type: String,
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

const dialog = ref(false)

const { mutate: removeConfig, loading, onDone, onError } = useMutation(RemoveConfig, () => ({
  variables: {
    title: props.title,
  },
  refetchQueries: [{
    query: GetConfigs,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  dialog.value = false
  uiStore.appendMsg({
    type: 'success',
    msg: `Configuration ${props.title} successfully removed`,
  })
})

onError(e => {
  uiStore.appendMsg({
    type: 'error',
    msg: e.message,
  })
})

</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
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
      >Remove</v-btn>
    </template>
    <template #default="{ }">
      <v-card border class="mx-auto" flat max-width="500">
        <v-list-item class="px-6" height="88">
          <template #append>
            <v-icon color="warning" :icon="IconAlertOctagon" />
          </template>
          <template #title> {{ $t('msgs.sureRemoveConfig', 1) }}</template>
        </v-list-item>

        <v-divider />

        <v-card-text class="text-medium-emphasis pa-6">
          <div class="text-h6 mb-6">{{ $t('msgs.actionCantUndo') }}</div>
          <div class="my-4">Configuration: <v-chip color="red" variant="outlined">{{ props.title }}</v-chip></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">{{ $t('actions.Cancel') }}</v-btn>
          <v-btn
            color="error"
            :loading="loading"
            variant="flat"
            @click="removeConfig"
          >{{ $t('actions.Remove') }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

<!--  <v-btn color="error">-->
<!--    <template #prepend>-->
<!--      <IconTrash />-->
<!--    </template>-->
<!--    Remove-->
<!--    <v-dialog v-model="dialog" activator="parent" max-width="600">-->
<!--      <v-card-->
<!--        subtitle="Are you sure you want to remove this configuration?"-->
<!--        title="Remove Configuration"-->
<!--      >-->
<!--        <v-card-text>-->
<!--          <v-chip color="error" label>{{ props.title }}</v-chip>-->
<!--          <v-alert-->
<!--            v-if="error"-->
<!--            class="mt-4"-->
<!--            color="error"-->
<!--            :text="error.message"-->
<!--          />-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-btn-->
<!--            color="error"-->
<!--            :loading="loading"-->
<!--            text="true"-->
<!--            variant="outlined"-->
<!--            @click="removeConfig({ title: props.title })"-->
<!--          > Confirm </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
<!--  </v-btn>-->
</template>
