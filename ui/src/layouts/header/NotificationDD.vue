<script setup lang="ts">
import { watch } from 'vue'
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeAlerts } from '@/layouts/header/graphql'
import { useAlertsStore } from '@/stores/alerts'
import moment from 'moment'

const alertStore = useAlertsStore()

const { result } = useSubscription(SubscribeAlerts, {
  offset: 0,
})

watch(
  result,
  data => {
    alertStore.appendAlert(data.alerts)
  },
)

function markAllRead () {
  alertStore.markAllAsRead()
}

</script>

<template>
  <v-menu :close-on-content-click="false" offset="6, 0">
    <template #activator="{ props }">
      <v-btn
        class="text-secondary ml-sm-2 ml-1"
        color="darkText"
        icon
        rounded="sm"
        size="small"
        v-bind="props"
      >
        <v-badge
          color="primary"
          :content="alertStore.unreadAlertsCount"
          offset-x="-4"
          offset-y="-5"
        >
          <BellOutlined :style="{ fontSize: '16px' }" />
        </v-badge>
      </v-btn>
    </template>
    <v-sheet class="notification-dropdown" rounded="md" width="387">
      <div class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <h6 class="text-subtitle-1 mb-0">Notifications</h6>
          <v-btn
            :class="alertStore.unreadAlertsCount ? 'd-block' : 'd-none'"
            color="success"
            icon
            rounded
            size="small"
            variant="text"
            @click="markAllRead"
          >
            <CheckCircleOutlined :style="{ fontSize: '16px' }" />
            <v-tooltip activator="parent" aria-label="tooltip" :content-class="alertStore.unreadAlertsCount ? 'custom-tooltip' : 'd-none'" location="bottom">
              <span class="text-caption">Mark as all read</span>
            </v-tooltip>
          </v-btn>
        </div>
      </div>
      <v-divider />
      <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 265px">
        <v-list
          aria-busy="true"
          aria-label="notification list"
          class="py-0"
          lines="two"
        >
          <template v-for="alert in alertStore.alerts" :key="alert.id">
            <v-list-item
              :active="alertStore.isAlertRead(alert.id)"
              class="no-spacer py-1"
              color="secondary"
              :value="alert.id"
              @click="alertStore.markAsRead(alert.id)"
            >
              <template #prepend>
                <v-avatar class="mr-3 py-2 text-success" color="warning" size="36" variant="flat">
                  <ExclamationCircleIcon />
                </v-avatar>
              </template>
              <div class="d-inline-flex justify-space-between w-100">
                <h6 class="text-subtitle-1 font-weight-regular mb-0">
                  {{ alert.message }}
                </h6>
                <span class="text-caption">{{ moment(alert.timestamp).calendar() }}</span>
              </div>
              <p class="text-caption text-medium-emphasis my-0">{{ alert.machineName }}</p>
            </v-list-item>
            <v-divider />
          </template></v-list>
      </perfect-scrollbar>
      <v-divider />
      <div class="pa-2 text-center">
        <v-btn color="primary" variant="text">View All</v-btn>
      </div>
    </v-sheet>
  </v-menu>
</template>

<style lang="scss">
.v-tooltip {
  > .v-overlay__content.custom-tooltip {
    padding: 2px 6px;
  }
}
</style>
