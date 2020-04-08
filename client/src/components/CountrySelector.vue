<template>
  <CountriesContainer
    v-slot="{ countries }"
    class="country-selector"
  >
    <div class="m-20">
      <Select
        v-model="value"
        :items="countries.map(item => ({ label: item.name, value: item.slug }))"
        placeholder="Select your country"
      />
      <div
        v-if="slug"
        class="text-center pt-30"
      >
        <button
          class="btn fs-18 cp"
          @click="onSubmit"
        >
          View curve for {{ label }}
        </button>
      </div>
    </div>
  </CountriesContainer>
</template>

<script>
import CountriesContainer from '@/containers/CountriesContainer'
import Select from '@/components/Select'

export default {
  components: { CountriesContainer, Select },
  data() {
    return {
      value: ''
    }
  },
  computed: {
    label() {
      return this.value ? this.value.label : null
    },
    slug() {
      return this.value ? this.value.value : null
    }
  },
  methods: {
    onSubmit() {
      this.$router.push({ path: '/country/' + this.slug })
    }
  }
}
</script>

<style lang="scss">
.country-selector {
  margin: 0 auto;
  width: 100%;
  max-width: 480px;
}
</style>
