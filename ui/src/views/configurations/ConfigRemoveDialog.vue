<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { GetConfigs, RemoveConfig } from '@/views/query/config'
import { IconTrash } from '@tabler/icons-vue'

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
})

</script>

<template>
  <v-btn color="error">
    <template #append>
      <IconTrash />
    </template>
    Remove
    <v-dialog v-model="dialog" activator="parent" max-width="600">
      <v-card>
        <v-card-text>
          Are you sure you want to remove this config ?
          <v-chip color="error" label>{{ props.title }}</v-chip>
          <v-alert v-if="error" class="mt-4" color="error" :text="error.message" />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="error"
            :loading="loading"
            variant="tonal"
            @click="removeConfig({ title: props.title })"
          > Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>
