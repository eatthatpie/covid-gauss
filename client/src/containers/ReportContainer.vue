<template>
  <div class="__report-container">
    <slot v-bind="{ report, history, maxError }" />
  </div>
</template>

<script>
import { makeQuery, queryHistoricalReport, queryReport } from '@/gql'
import { getRelativeDate } from '@/helpers'

export default {
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      history: null,
      maxError: null,
      report: false
    }
  },
  mounted() {
    makeQuery(queryReport, { slug: this.slug })
      .then(res => {
        this.report = res.report
        this.maxError = this.calculateMaxError(this.report.estimation.curve_params)

        setTimeout(() => {
          Promise.all([
            makeQuery(queryHistoricalReport, { slug: this.slug, date: getRelativeDate(-1) }),
            makeQuery(queryHistoricalReport, { slug: this.slug, date: getRelativeDate(-7) }),
            makeQuery(queryHistoricalReport, { slug: this.slug, date: getRelativeDate(-14) })
          ])
            .then(res => {
              this.history = res.map(v => v.report)
            })
            .catch(e => {
              this.history = false
            })
        }, 0)
      })
      .catch(e => {
        this.report = false
      })
      .finally(() => {
        this.$emit('done', !!this.report)
      })
  },
  methods: {
    calculateMaxError(params) {
      const m = Math.round(10000 * params[4] / params[1]) / 100
      const s = Math.round(10000 * params[5] / params[2]) / 100

      return Math.max(Math.abs(m), Math.abs(s))
    }
  }
}
</script>
