<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { RemoveSector } from '@/views/query/sector'
import { IconTrash } from '@tabler/icons-vue'

const props = defineProps({
  miner: {
    type: String,
    required: true,
  },
  sectorNumber: {
    type: Number,
    required: true,
  },
})

const dialog = ref(false)

const { mutate, loading, error } = useMutation(RemoveSector)

function removeSector () {
  mutate({
    miner: props.miner,
    sectorNumber: props.sectorNumber,
  }).then(() => {
    if (!error.value) {
      dialog.value = false
    }
  })
}

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
          Are you sure you want to remove this sector?
          <v-alert v-if="error" class="mt-4" color="error" :text="error.message" />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="error"
            :loading="loading"
            variant="tonal"
            @click="removeSector"
          > Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>
