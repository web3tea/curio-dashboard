<script setup lang="ts">
type Breadcrumb = {
  title: string;
  disabled: boolean;
  href: string;
};

const props = defineProps({
  title: String,
  breadcrumbs: Array as () => Breadcrumb[],
  icon: String,
})
</script>

// ===============================|| Theme Breadcrumb ||=============================== //
<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row class="align-center" no-gutters>
          <v-col sm="12">
            <v-breadcrumbs class="text-h6 pa-1 font-weight-medium mb-0" :items="props.breadcrumbs">
              <template #divider>
                <div class="d-flex align-center">/</div>
              </template>
              <template #prepend>
                <router-link class="text-lightText text-h6 text-decoration-none" to="/"> Home </router-link>
                <div class="d-flex align-center px-2">/</div>
              </template>
            </v-breadcrumbs>
            <h3 class="text-h3 mt-1 mb-0">{{ props.title }}</h3>
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
