<template>
  <div class="__countries-container">
    <slot v-bind="{ countries }" />
  </div>
</template>

<script>
import { makeQuery, queryAllCountries } from '@/gql'

export default {
  data() {
    return {
      countries: []
    }
  },
  mounted() {
    makeQuery(queryAllCountries)
      .then(res => {
        this.countries = res.countries.map(item => {
          if (!item.province_name) {
            return item
          } else {
            return {
              ...item,
              name: `${item.name} (${item.province_name})`
            }
          }
        })
      })
  }
}
</script>