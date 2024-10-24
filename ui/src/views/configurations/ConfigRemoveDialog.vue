<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { GetConfigs, RemoveConfig } from '@/views/query/config'
import { IconTrash } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'
const uiStore = useUIStore()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const dialog = ref(false)

const { mutate: removeConfig, loading, onDone, error } = useMutation(RemoveConfig, () => ({
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

</script>

<template>
  <v-btn color="error">
    <template #append>
      <IconTrash />
    </template>
    Remove
    <v-dialog v-model="dialog" activator="parent" max-width="600">
      <v-card
        subtitle="Are you sure you want to remove this configuration?"
        title="Remove Configuration"
      >
        <v-card-text>
          <v-chip color="error" label>{{ props.title }}</v-chip>
          <v-alert
            v-if="error"
            class="mt-4"
            color="error"
            :text="error.message"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            :loading="loading"
            text="true"
            variant="outlined"
            @click="removeConfig({ title: props.title })"
          > Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>
