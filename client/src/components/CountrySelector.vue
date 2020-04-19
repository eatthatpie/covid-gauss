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
    <p class="fs-18 text-center pt-40">
      Most viewed countries
    </p>
    <p class="fs-18 text-center">
      <RouterLink
        v-for="item in ignoreCurrentUrl(quickLinks)"
        :key="item.url"
        :to="item.url"
        class="mh-7 color-primary paragraph-inline"
        v-text="item.label"
      />
    </p>
  </CountriesContainer>
</template>

<script>
import CountriesContainer from '@/containers/CountriesContainer'
import Select from '@/components/Select'

export default {
  components: { CountriesContainer, Select },
  data() {
    return {
      quickLinks: [
        {
          label: 'US',
          url: '/country/us'
        },
        {
          label: 'India',
          url: '/country/india'
        },
        {
          label: 'United Kingdom',
          url: '/country/united-kingdom'
        },
        {
          label: 'Poland',
          url: '/country/poland'
        },
        {
          label: 'Kyrgyzstan',
          url: '/country/kyrgyzstan'
        },
        {
          label: 'Germany',
          url: '/country/germany'
        },
        {
          label: 'Netherlands',
          url: '/country/netherlands'
        },
        {
          label: 'France',
          url: '/country/france'
        },
        {
          label: 'Serbia',
          url: '/country/serbia'
        },
        {
          label: 'Turkey',
          url: '/country/turkey'
        },
        {
          label: 'Sweden',
          url: '/country/sweden'
        },
        {
          label: 'Brazil',
          url: '/country/brazil'
        },
        {
          label: 'Romania',
          url: '/country/romania'
        },
        {
          label: 'Ukraine',
          url: '/country/ukraine'
        },
        {
          label: 'Mexico',
          url: '/country/mexico'
        },
        {
          label: 'Spain',
          url: '/country/spain'
        },
        {
          label: 'United Arab Emirates',
          url: '/country/united-arab-emirates'
        },
        {
          label: 'Denmark',
          url: '/country/denmark'
        },
        {
          label: 'Norway',
          url: '/country/norway'
        },
        {
          label: 'Montenegro',
          url: '/country/montenegro'
        },
        {
          label: 'Italy',
          url: '/country/italy'
        },
        {
          label: 'Switzerland',
          url: '/country/switzerland'
        }
      ],
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
    ignoreCurrentUrl(arr) {
      return arr.filter(item => item.url !== this.$route.fullPath)
    },
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
