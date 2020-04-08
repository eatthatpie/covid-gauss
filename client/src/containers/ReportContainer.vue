<template>
  <div class="__report-container">
    <slot v-bind="{ report }" />
  </div>
</template>

<script>
import { makeQuery, queryReport } from '@/gql'

export default {
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      report: null
    }
  },
  mounted() {
    makeQuery(queryReport, { slug: this.slug })
      .then(res => {
        this.report = res.report
      })
  }
}
</script>
