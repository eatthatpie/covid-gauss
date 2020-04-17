<template>
  <p class="indicator">
    <span class="color-gray fs-14 paragraph">
      {{ label }}
    </span>
    <span class="fs-18">
      {{ formatValue(value) }}
    </span>
    <span
      v-if="hasHistory"
      :class="[
      'indicator-change',
      'fs-14',
      {
        'red': historicalValuesMapped[0].change > 0
        }
      ]"
      title="Show more historical values"
      @click="isOpen = !isOpen"
    >
      <i :class="[
        'fas',
        {
          'fa-caret-down': historicalValuesMapped[0].change < 0,
          'fa-caret-up': historicalValuesMapped[0].change > 0
          }
        ]"
      />
      {{ formatChange(historicalValuesMapped[0].change) }}
    </span>
    <span
      v-if="hasHistory && isOpen"
      class="indicator-history paragraph fs-14 mt-1em mh-a"
    >
      <span
        v-for="item in historicalValuesMapped"
        :key="item.value"
        class="flex"
      >
        <span v-if="item.value && valueType === 'int'">
          {{ item.label }} change (from {{ formatValue(item.value) }}):
        </span>
        <span v-else-if="item.value">
          {{ item.label }} change:
        </span>
        <span
           v-if="item.value"
          :class="{ 'color-red': item.change > 0, 'color-green': item.change < 0 }"
        >
          <i :class="[
            'fas',
            {
              'fa-caret-down': item.change < 0,
              'fa-caret-up': item.change > 0
              }
            ]"
          />
          {{ formatChange(item.change) }}
        </span>
      </span>
    </span>
  </p>
</template>

<script>
import { formatDate } from '@/helpers'

export default {
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: String|Number,
      default: null
    },
    valueType: {
      type: String,
      default: 'int'
    },
    historicalValues: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    hasHistory() {
      return this.historicalLabels.filter(item => !!item).length > 0
    },
    historicalLabels() {
      return this.historicalValues ? Object.keys(this.historicalValues) : []
    },
    historicalValuesMapped() {
      if (!this.historicalLabels.length) {
        return []
      }

      return this.historicalLabels.map(label => {
        const histValue = this.historicalValues[label]
        const change = this.calculateChange(this.value, histValue)

        return {
          label,
          value: histValue,
          change: change
        }
      })
    }
  },
  methods: {
    calculateChange(curr, prev) {
      if (this.valueType === 'int') {
        return prev > 0 ? Math.round(((curr - prev) / prev) * 10000) / 100 : 0
      } else if (this.valueType === 'date') {
        if (new Date(prev).getTime() === 0) {
          return 0
        }

        const diff = new Date(curr).getTime() - new Date(prev).getTime()

        return Math.round(diff / (1000 * 3600 * 24))
      }
    },
    formatChange(value) {
      if (this.valueType === 'int') {
        return Math.abs(value).toFixed(2) + '%'
      } else if (this.valueType === 'date') {
        return Math.abs(value) + ' d'
      }
    },
    formatValue(value) {
      if (this.valueType === 'int') {
        return value || '-'
      } else if (this.valueType === 'date') {
        if (new Date(value).getTime() === 0) {
          return '-'
        }

        return formatDate(value)
      }
    }
  }
}
</script>

<style lang="scss">
.indicator {
  &-change {
    color: green;
    border-bottom: dashed 1px green;
    margin-left: 10px;
    top: -2px;
    position: relative;
    cursor: pointer;

    &.red {
      color: red;
      border-bottom: dashed 1px red;
    }
  }

  &-history {
    width: 320px;
    max-width: 100%;
    z-index: 1;
    position: relative;

    &:before {
      content: '';
      border: 1px dashed #d2d2d2;
      background-color: #f6f6f6;
      top: -5px;
      bottom: -6px;
      left: -20px;
      right: -20px;
      z-index: -1;
      position: absolute;
    }
  }
}
</style>