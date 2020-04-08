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
    },
    done: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      report: false
    }
  },
  mounted() {
    makeQuery(queryReport, { slug: this.slug })
      .then(res => {
        this.report = res.report
      })
      .catch(e => {
        this.report = false
      })
      .finally(() => {
        this.$emit('done')
      })
  },
  methods: {
    done() {}
  }
}
</script>
