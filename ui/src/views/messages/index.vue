<script setup lang="ts">
import { ref } from "vue"
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import MessageSendsTable from "@/views/messages/widgets/MessageSendsTable.vue"

const breadcrumbs = ref([
  {
    title: 'Messages',
    disabled: true,
    href: '#',
  },
  {
    title: 'Sends',
    disabled: true,
    href: '#',
  },
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12" lg="12">
      <MessageSendsTable />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
