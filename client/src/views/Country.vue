<template>
  <div class="__page">
    <Loader :isActive="isLoading" />
    <p
      v-if="!isReportValid"
      class="frame text-center fs-16"
    >
      No data for this country.
    </p>
    <ReportContainer
      v-slot="{ report }"
      :slug="slug"
      class="bg"
      @done="onLoadingDone"
    >
      <h1 class="fs-20 text-center">
        <div class="fs-32">{{ report.country.name }}</div>
        <div class="pt-10">
          COVID-19 timeline prediction with Gaussian curve
        </div>
      </h1>
      <p class="text-center fs-16">
        Predictions are based on a mathematical model and should not be considered a reliable source.
      </p>
      <p
        v-if="!report.has_valid_estimation"
        class="frame text-center fs-16"
      >
        Due to the structure of actual data for this country we are not able to accurately estimate the timeline.
      </p>
      <p
        v-if="report.has_valid_estimation"
        class="text-center"
      >
        <span class="color-gray fs-14">Estimated last day date</span><br>
        <span class="fs-18">{{ formatDate(report.estimation.last_day_date) }}</span>
      </p>
      <p
        v-else
        class="text-center"
      >
        <span class="color-gray fs-14">Recently infected</span><br>
        <span class="fs-18">{{ report.recent_total_infected }}</span>
      </p>
      <div>
        <Chart :data="report" />
      </div>
      <div
        v-if="report && report.has_valid_estimation"
        class="w-320 mt-120 mh-a mb-0"
      >
        <!-- <p>
          <span class="color-gray fs-14">Estimated last day date</span><br>
          <span class="fs-18">{{ report.estimation.last_day_date }}</span>
        </p> -->
        <p>
          <span class="color-gray fs-14">Estimated peak date</span><br>
          <span class="fs-18">{{ formatDate(report.estimation.peak_day_date) }}</span>
        </p>
        <p>
          <span class="color-gray fs-14">Estimated new infections at peak day</span><br>
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
      <div
        v-else
        class="mt-80"
      />
    </ReportContainer>
    <!-- <p class="pt-40 ph-20 text-center fs-16">
     Remember: this is only an estimation.
    </p>
    <p class="ph-20 text-center fs-16">
      The only thing we know for sure is if we stay home we can make the curve flatter, and numbers above better.
    </p> -->
    <div class="pv-40 ph-20">
      <CountrySelector />
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Chart'
import CountrySelector from '@/components/CountrySelector'
import Loader from '@/components/Loader'
import ReportContainer from '@/containers/ReportContainer'
import { formatDate } from '@/helpers'

export default {
  components: { Chart, CountrySelector, Loader, ReportContainer },
  data() {
    return {
      formatDate,
      isLoading: true,
      isReportValid: true
    }
  },
  computed: {
    slug() {
      return this.$route.params.slug
    }
  },
  methods: {
    onLoadingDone(isReportValid) {
      this.isLoading = false
      this.isReportValid = isReportValid
    }
  }
}
</script>

<style lang="scss">
.__page {
  overflow-x: hidden;
  position: relative;
}
</style>
