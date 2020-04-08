<template>
  <div class="chart">
    <div class="flex flex-baseline">
      <div
        v-for="item in data.daily"
        :key="item.date"
        :style="`height: ${250 * item.estimated_new_infected / data.estimation.peak_day_new_infected}px;`"
        :data-date="item.date"
        class="chart-column"
      >
        <div
          v-if="item.new_infected"
          :style="`height: ${250 * item.new_infected / data.estimation.peak_day_new_infected}px;`"
          class="chart-column-confirmed"
        />
        <div class="chart-column-label fs-14 text-center">
          {{ item.date }}<br>
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
import { getWindowWidth } from '@/helpers'

export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // Adjusting labels to window size
    const labels = document.querySelectorAll('.chart-column-label')

    for (let i = 0; i < labels.length; i++) {
      const w = getWindowWidth()
      const s = labels[i].offsetWidth + labels[i].offsetParent.offsetLeft

      if (s > w - 20) {
        labels[i].style.left = `${(w - s - 20)}px`
      }
    }
  }
}
</script>

<style lang="scss">
.chart {
  padding-top: 100px;
  height: 250px;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  &-column {
    cursor: pointer;
    background-color: #99999999;
    width: 100%;
    position: relative;

    &:nth-child(7n) {
      &:after {
        opacity: 1;
      }
    }

    &:before {
      content: '';
      pointer-events: none;
      position: absolute;
      border: 3px solid #99999999;
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

    &-confirmed {
      background-color: #99000055;
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
      &-label {
        opacity: 1;
      }
    }
  }
}
</style>
