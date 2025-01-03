<script setup lang="ts">
import { computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Breadcrumb {
  title: string;
  disabled: boolean;
  href: string;
}

const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  breadcrumbs: {
    type: Array as PropType<Breadcrumb[]>,
    required: true,
  },
  icon: {
    type: String,
    default: undefined,
  },
})

const getTitle = (breadcrumb: Breadcrumb, index: number) => {
  if (index === props.breadcrumbs.length - 1) {
    if (breadcrumb.title === 'List') {
      return t(`nav.List`)
    }
    return breadcrumb.title
  }
  return t(`nav.${breadcrumb.title}`)
}

const breadcrumbs = computed(() => {
  return props.breadcrumbs.map((breadcrumb, index) => ({
    ...breadcrumb,
    title: getTitle(breadcrumb, index),
  }))
})

</script>

<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col
      cols="12"
      md="12"
    >
      <v-card
        elevation="0"
        variant="text"
      >
        <v-row
          class="align-center"
          no-gutters
        >
          <v-col sm="12">
            <v-breadcrumbs
              class="text-h6 pa-1 font-weight-medium mb-0"
              :items="breadcrumbs"
            >
              <template #divider>
                <div class="d-flex align-center">
                  /
                </div>
              </template>
              <template #prepend>
                <router-link
                  class="text-lightText text-h6 text-decoration-none"
                  to="/"
                >
                  {{ $t('nav.Home') }}
                </router-link>
                <div class="d-flex align-center px-2">
                  /
                </div>
              </template>
            </v-breadcrumbs>
            <h3 class="text-h3 mt-1 mb-0">
              {{ props.title }}
            </h3>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.page-breadcrumb {
  .v-toolbar {
    background: transparent;
  }
}
</style>
