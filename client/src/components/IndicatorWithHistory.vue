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
    <!-- <span
      v-else-if="shouldHaveHistory"
      class="indicator-placeholder spin"
    /> -->
    <Loader
      v-else-if="shouldHaveHistory"
      :isActive="true"
      class="indicator-loader"
    />
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
import Loader from '@/components/Loader'
import { formatDate } from '@/helpers'

export default {
  components: { Loader },
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
    },
    shouldHaveHistory: {
      type: Boolean,
      default: true
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
  &-loader {
    height: 18px;
    width: 32px;
    margin-left: 10px;
    transform-origin: 0 100%;
    transform: scale(0.4, 0.5);
    display: inline-block;

    span {
      background-color: #99999999;

      &:nth-child(1) { height: 18px; animation: dance 1.5s 0s infinite; }
      &:nth-child(2) { height: 18px; animation: dance 1.8s 0.1s infinite; }
      &:nth-child(3) { height: 18px; animation: dance 0.9s 0.2s infinite; }
      &:nth-child(4) { height: 18px; animation: dance 1.5s 0.3s infinite; }
      &:nth-child(5) { height: 18px; animation: dance 1.5s 0.4s infinite; }
    }
  }

  &-placeholder {
    margin-left: 10px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    border-top: 1px solid #999;
    border-left: 1px solid #999;
    display: inline-block;
  }

  &-change {
    color: green;
    border-bottom: dashed 1px green;
    margin-left: 10px;
    top: -2px;
    line-height: 24px;
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

    @media (max-width: 480px) {
      max-width: calc(100% - 40px);
    }
  }
}
</style>
