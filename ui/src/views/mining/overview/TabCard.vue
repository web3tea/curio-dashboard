<script setup lang="ts">
import { ref } from 'vue'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'


import TotalChart from './TotalChart.vue'
import PaidChart from './PaidChart.vue'
import PendingChart from './PendingChart.vue'
import OverdueChart from './OverdueChart.vue'

// tabs data
const tab = ref(0)
</script>

<template>
  <v-card variant="outlined" class="bg-surface">
    <v-card-text>
      <v-tabs v-model="tab" color="primary" class="invoiceTab">
        <v-row>
          <v-col cols="12" md="3" sm="6">
            <v-tab value="1" tag="div" color="dark" hide-slider>
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1">Total</h6>
                      <h5 class="text-h5 mb-0">£5678.09</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 mr-1">3</h5>
                        <p class="text-h6 text-lightText mb-0">invoices</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <CaretDownOutlined class="text-warning" :style="{ fontSize: '12px' }" />
                      <h5 class="text-h5 text-lightText mb-0 ml-1">20.3%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-tab value="2" tag="div" color="dark" hide-slider>
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1 text-left">Paid</h6>
                      <h5 class="text-h5 mb-0">£5678.09</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 mr-1">5</h5>
                        <p class="text-h6 text-lightText mb-0">invoices</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <CaretDownOutlined class="text-error" :style="{ fontSize: '12px' }" />
                      <h5 class="text-h5 text-lightText mb-0 ml-1">-8.73%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-tab value="3" tag="div" color="dark" hide-slider>
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1 text-left">Pending</h6>
                      <h5 class="text-h5 mb-0">£5678.09</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 mr-1">20</h5>
                        <p class="text-h6 text-lightText mb-0">invoices</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <CaretUpOutlined class="text-success" :style="{ fontSize: '12px' }" />
                      <h5 class="text-h5 text-lightText mb-0 ml-1">1.73%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-tab value="4" tag="div" color="dark" hide-slider>
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1 text-left">Overdue</h6>
                      <h5 class="text-h5 mb-0">£5678.09</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 mr-1">5</h5>
                        <p class="text-h6 text-lightText mb-0">invoices</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <CaretDownOutlined class="text-primary" :style="{ fontSize: '12px' }" />
                      <h5 class="text-h5 text-lightText mb-0 ml-1">-4.7%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
        </v-row>
      </v-tabs>
      <v-window v-model="tab" class="mt-5">
        <v-window-item value="1">
          <TotalChart />
        </v-window-item>

        <v-window-item value="2">
          <PaidChart />
        </v-window-item>

        <v-window-item value="3">
          <PendingChart />
        </v-window-item>

        <v-window-item value="4">
          <OverdueChart />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<style lang="scss">
.invoiceTab {
  --v-tabs-height: unset;
  .v-slide-group__content {
    @media (max-width: 960px) {
      flex: unset;
    }
  }
  .v-tab {
    width: auto;
    height: 100%;
    min-width: unset;
    --v-btn-height: unset;
    padding: 0;
    display: block;
    &.v-slide-group-item--active {
      > .v-btn__overlay {
        opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
      }
    }
  }
}
</style>
