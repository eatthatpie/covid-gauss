<template>
  <div class="__page">
    <h1 class="fs-20 text-center">
      COVID-19 timeline prediction<br>
      <small>
        with Gaussian curve
      </small>
    </h1>
    <p class="text-center fs-16">
      Predictions are based on a mathematical model and should not be considered a reliable source.
    </p>
    <div class="pv-40 ph-20">
      <CountrySelector />
    </div>
    <p class="fs-18 text-center pt-20">
      See more
    </p>
    <ul class="text-center pv-10">
      <li>
        <a
          href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/events-as-they-happen"
          target="_blank"
          rel="noreferrer"
          class="color-primary fs-18"
        >
          WHO Updates on COVID-19
        </a>
      </li>
      <li>
        <a
          href="https://en.wikipedia.org/wiki/Normal_distribution"
          target="_blank"
          rel="noreferrer"
          class="color-primary fs-16"
        >
          Wikipedia article about normal distribution
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import CountrySelector from '@/components/CountrySelector'

export default {
  components: { CountrySelector },
  computed: {
    $t() {
      return this.$store.getters['dict/getTranslation']
    }
  }
}
</script>
