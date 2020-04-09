<!--
  @TODO
  Refactor this.
-->
<template>
  <div class="chart">
    <div class="flex flex-baseline h-250">
      <div
        v-for="item in data.daily"
        :key="item.date"
        :data-date="formatDate(item.date)"
        class="chart-column w-100p h-250"
      >
        <div
          :style="`height: ${containerHeightRatio * item.estimated_new_infected}px;`"
          class="chart-column-estimated bg-gray-muted"
        />
        <div
          v-if="item.new_infected"
          :style="`height: ${containerHeightRatio * item.new_infected}px;`"
          class="chart-column-confirmed bg-red-muted"
        />
        <div class="chart-column-label fs-14 text-center">
          {{ formatDate(item.date) }}<br>
          <div v-if="item.new_infected">
            confirmed new infections: {{ item.new_infected }}
          </div>
          <div v-else>
            est. new infections: {{ item.estimated_new_infected }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, getWindowWidth } from '@/helpers'

export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      desiredColumnHeight: 250,
      formatDate
    }
  },
  computed: {
    hasValidEstimation() {
      return this.data && this.data.has_valid_estimation
    },
    containerHeight() {
      if (!this.hasValidEstimation) {
        return this.data.max_actual_new_infections_daily
      }

      return this.data.max_actual_new_infections_daily < this.data.estimation.peak_day_new_infected
        ? this.data.estimation.peak_day_new_infected
        : this.data.max_actual_new_infections_daily
    },
    containerHeightRatio() {
      if (this.containerHeight) {
        return this.desiredColumnHeight / this.containerHeight
      }

      return 1
    }
  },
  mounted() {
    // Adjusting labels to window size
    const labels = document.querySelectorAll('.chart-column-label')

    for (let i = 0; i < labels.length; i++) {
      const w = getWindowWidth()
      const s = (
        labels[i].offsetWidth +
        labels[i].offsetParent.offsetLeft +
        labels[i].offsetParent.offsetParent.offsetLeft
      )

      if (s > w - 20) {
        labels[i].style.left = `${(w - s - 20)}px`
      }
    }
  }
}
</script>

<style lang="scss">
.chart {
  padding-top: 60px;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  &-column {
    cursor: pointer;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;

    &:nth-child(7n) {
      &:after {
        opacity: 1;
      }
    }

    &:before {
      content: '';
      pointer-events: none;
      position: absolute;
      background-color: #99999933;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 0;
    }

    &:after {
      content: attr(data-date);
      transform-origin: 0 100%;
      transform: rotate(80deg);
      color: var(--color-muted);
      position: absolute;
      white-space: nowrap;
      top: 100%;
      font-size: 11px;
      opacity: 0;
    }

    &-confirmed,
    &-estimated {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &-label {
      background-color: #000;
      color: #fff;
      opacity: 0;
      z-index: 1;
      left: 0;
      bottom: 100%;
      padding: 5px;
      margin-bottom: 10px;
      white-space: nowrap;
      pointer-events: none;
      position: absolute;
    }

    &:hover {
      &:before {
        opacity: 1;
      }
    }

    &:hover & {
      margin: 100px;
      &-label {
        opacity: 1;
      }
    }
  }
}
</style>
