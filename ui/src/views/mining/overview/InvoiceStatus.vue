<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  CloseCircleFilled,
  DollarCircleFilled,
  FileTextFilled,
  HourglassFilled,
  ReconciliationFilled,
  ShoppingFilled
} from '@ant-design/icons-vue'


const invoiceData = shallowRef([
  {
    icon: FileTextFilled,
    title: 'All Invoices',
    color: 'primary'
  },
  {
    icon: ReconciliationFilled,
    title: 'Reports',
    color: 'info'
  },
  {
    icon: DollarCircleFilled,
    title: 'Paid',
    color: 'success'
  },
  {
    icon: HourglassFilled,
    title: 'Pending',
    color: 'warning'
  },
  {
    icon: CloseCircleFilled,
    title: 'Cancelled',
    color: 'error'
  },
  {
    icon: ShoppingFilled,
    title: 'Draft',
    color: 'primary'
  }
])
</script>
<template>
  <v-card variant="outlined" class="bg-surface">
    <v-card-text>
      <v-row>
        <v-col v-for="item in invoiceData" :key="item.title" cols="6" lg="6" sm="4">
          <v-card variant="outlined" class="text-center">
            <v-card-item>
              <v-avatar :color="item.color">
                <component :is="item.icon" :style="{ fontSize: '16px' }" />
              </v-avatar>
              <h6 class="text-subtitle-1 text-lightText mb-0 mt-4">{{ item.title }}</h6>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
