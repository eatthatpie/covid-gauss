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
      v-slot="{ report, history, maxError }"
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
        v-else-if="maxError > 30"
        class="frame text-center fs-16"
      >
        The approximation error is large. Calculations may be very inaccurate.
      </p>
      <p
        v-else-if="maxError > 15"
        class="frame warning text-center fs-16"
      >
        The approximation error is significant. Calculations may be inaccurate.
      </p>
      <IndicatorWithHistory
        v-if="report.has_valid_estimation"
        :label="`Estimated last day of new infections`"
        :value="report.estimation.last_day_date"
        :historicalValues="history
          ? {
            '24h': history[0].estimation.last_day_date,
            '1 week': history[1].estimation.last_day_date,
            '2 weeks': history[2].estimation.last_day_date
          }
          : null
        "
        valueType="date"
        class="text-center"
      />
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
        class="w-320 max-w-100p mt-120 mh-a mb-0"
      >
        <IndicatorWithHistory
          :label="`Estimated curve peak date`"
          :value="report.estimation.curve_peak_day_date"
          :historicalValues="history
            ? {
              '24h': history[0].estimation.curve_peak_day_date,
              '1 week': history[1].estimation.curve_peak_day_date,
              '2 weeks': history[2].estimation.curve_peak_day_date
            }
            : null
          "
          valueType="date"
        />
        <IndicatorWithHistory
          :label="`Estimated number of infections at curve peak day`"
          :value="report.estimation.curve_peak_day_new_infected"
          :historicalValues="history
            ? {
              '24h': history[0].estimation.curve_peak_day_new_infected,
              '1 week': history[1].estimation.curve_peak_day_new_infected,
              '2 weeks': history[2].estimation.curve_peak_day_new_infected
            }
            : null
          "
        />
        <IndicatorWithHistory
          :label="`Recently infected`"
          :value="report.recent_total_infected"
          :historicalValues="history
            ? {
              '24h': history[0].recent_total_infected,
              '1 week': history[1].recent_total_infected,
              '2 weeks': history[2].recent_total_infected
            }
            : null
          "
        />
        <IndicatorWithHistory
          :label="`Estimated number of upcoming infections`"
          :value="report.estimation.upcomming_infected"
          :historicalValues="history
            ? {
              '24h': history[0].estimation.upcomming_infected,
              '1 week': history[1].estimation.upcomming_infected,
              '2 weeks': history[2].estimation.upcomming_infected
            }
            : null
          "
        />
        <!-- <IndicatorWithHistory
          :label="`Estimated number of upcoming infections`"
          :value="report.estimation.upcomming_infected"
          :historicalValues="history
            ? {
              '24h': report.estimation.total_infected - history[0].recent_total_infected,
              '1 week': report.estimation.total_infected - history[1].recent_total_infected,
              '2 weeks': report.estimation.total_infected - history[2].recent_total_infected
            }
            : null
          "
        /> -->
         <IndicatorWithHistory
          :label="`Estimated total infections`"
          :value="report.estimation.total_infected"
          :historicalValues="history
            ? {
              '24h': history[0].estimation.total_infected,
              '1 week': history[1].estimation.total_infected,
              '2 weeks': history[2].estimation.total_infected
            }
            : null
          "
        />
      </div>
      <div
        v-else
        class="mt-80"
      />
    </ReportContainer>
    <div class="pv-40 ph-20">
      <CountrySelector />
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Chart'
import CountrySelector from '@/components/CountrySelector'
import Indicator from '@/components/Indicator'
import IndicatorWithHistory from '@/components/IndicatorWithHistory'
import Loader from '@/components/Loader'
import ReportContainer from '@/containers/ReportContainer'
import { formatDate } from '@/helpers'

export default {
  components: {
    Chart,
    CountrySelector,
    Loader,
    Indicator,
    IndicatorWithHistory,
    ReportContainer
  },
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
