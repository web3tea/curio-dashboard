<script setup lang="ts">
import { IconFilter, IconSearch } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  /**
   * The title of the column being filtered
   */
  columnTitle: { type: String, required: true },

  /**
   * Controls whether the filter menu is open
   */
  menuOpen: { type: Boolean, default: false },

  /**
   * Array of currently selected filter values
   */
  selectedItems: {
    type: Array as () => string[],
    default: () => []
  },

  /**
   * Title of the filter dialog
   */
  filterTitle: { type: String, required: true },

  /**
   * Available options for filtering
   */
  options: {
    type: Array as () => string[],
    required: true
  },

  /**
   * Current search term in the filter search box
   */
  searchValue: { type: String, default: '' }
})

const emit = defineEmits([
  'update:menuOpen',
  'update:selectedItems',
  'update:searchValue',
  'clear'
])

/**
 * Close the menu
 */
const closeMenu = () => {
  emit('update:menuOpen', false)
}

/**
 * Clear all selected filters
 */
const clearFilters = () => {
  emit('clear')
}
</script>

<template>
  <v-menu
    :model-value="menuOpen"
    :close-on-content-click="false"
    @update:model-value="emit('update:menuOpen', $event)"
  >
    <!-- Filter button -->
    <template #activator="{ props }">
      <div class="d-flex align-center">
        {{ columnTitle }}
        <v-btn
          variant="text"
          :icon="IconFilter"
          size="small"
          v-bind="props"
          :color="selectedItems.length ? 'primary' : undefined"
        />
      </div>
    </template>

    <!-- Filter menu content -->
    <v-card
      min-width="300"
      max-width="400"
      class="filter-menu-card"
    >
      <v-card-title class="text-body-1 py-3">
        {{ filterTitle }}
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- Search box -->
        <v-text-field
          :model-value="searchValue"
          :label="t('tableFilter.search')"
          density="compact"
          hide-details
          class="mb-3"
          variant="outlined"
          @update:model-value="emit('update:searchValue', $event)"
        >
          <template #prepend-inner>
            <IconSearch
              :size="16"
              stroke-width="2"
            />
          </template>
        </v-text-field>

        <!-- Filter options -->
        <div class="filter-options-container">
          <v-checkbox
            v-for="option in options"
            :key="option"
            :model-value="selectedItems"
            :value="option"
            :label="option"
            hide-details
            density="compact"
            class="my-1"
            @update:model-value="emit('update:selectedItems', $event)"
          />
        </div>
      </v-card-text>

      <!-- Action buttons -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="clearFilters"
        >
          {{ t('tableFilter.clear') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          @click="closeMenu"
        >
          {{ t('tableFilter.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
/* Filter menu styling */
.filter-options-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
}

.filter-menu-card {
  max-height: 500px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Make filter checkboxes more compact */
:deep(.v-selection-control) {
  margin-bottom: 0;
}

:deep(.v-btn--icon) {
  margin-left: 4px;
  transition: color 0.2s ease;
}
</style>
