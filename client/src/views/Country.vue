<template>
  <div class="__page">
    <ReportContainer
      v-slot="{ report }"
      :slug="slug"
    >
      <h1 class="fs-20 text-center">
        <div class="fs-32">{{ report.country.name }}</div>
        <div class="pt-10">
          COVID-19 timeline prediction with Gauss curve
        </div>
      </h1>
      <p class="text-center fs-16">
        Predictions are based on mathematical model and are not ment to be considered a reliable source.
      </p>
      <p
        v-if="slug === 'poland'"
        class="frame text-center fs-16"
      >
        Estimation for this country is made with consideration of confirmed data till April 1st 2020.
      </p>
      <p class="text-center">
          <span class="color-gray fs-14">Estimated last day date</span><br>
          <span class="fs-18">{{ report.estimation.last_day_date }}</span>
        </p>
      <div class="pt-30">
        <Chart :data="report" />
      </div>
      <div
        v-if="report"
        style="width: 320px; margin: 120px auto 0;"
      >
        <p>
          <span class="color-gray fs-14">Estimated peak date</span><br>
          <span class="fs-18">{{ report.estimation.peak_day_date }}</span>
        </p>
        <p>
          <span class="color-gray fs-14">Estimated new infections at peek day</span><br>
          <span class="fs-18">{{ report.estimation.peak_day_new_infected }}</span>
        </p>
        <p>
          <span class="color-gray fs-14">Recently infected</span><br>
          <span class="fs-18">{{ report.recent_total_infected }}</span>
        </p>
        <p>
          <span class="color-gray fs-14">Estimated new infections till last day</span><br>
          <span class="fs-18">{{ report.estimation.upcomming_infected }}</span>
        </p>
        <p>
          <span class="color-gray fs-14">Estimated total infections</span><br>
          <span class="fs-18">{{ report.estimation.total_infected }}</span>
        </p>
      </div>
    </ReportContainer>
    <div class="pv-40 ph-20">
      <CountrySelector />
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Chart'
import CountrySelector from '@/components/CountrySelector'
import ReportContainer from '@/containers/ReportContainer'

export default {
  components: { Chart, CountrySelector, ReportContainer },
  computed: {
    slug() {
      return this.$route.params.slug
    }
  },
}
</script>

<style lang="scss">
.__page {
  overflow-x: hidden;
}
</style>
