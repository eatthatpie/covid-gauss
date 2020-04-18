<template>
  <div class="__report-container">
    <slot v-bind="{ report, history }" />
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
      report: false
    }
  },
  mounted() {
    makeQuery(queryReport, { slug: this.slug })
      .then(res => {
        this.report = res.report

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
  }
}
</script>
