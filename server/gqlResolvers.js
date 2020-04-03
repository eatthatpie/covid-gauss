const createEstimationReport = require('./createEstimationReport');
const { Country, DailyReport } = require('./models');

const gqlResolvers = {
  country: async function({ slug }) {
    const match = await Country.findOne({ slug });

    if (!match || !match.length) {
      return null;
    }

    return {
      id: match._id,
      name: match.name,
      province_name: match.province_name,
      slug: match.slug,
      lat: match.lat,
      lng: match.lng
    };
  },
  countries: async function() {
    const match = await Country.find();

    if (!match || !match.length) {
      return null;
    }

    return match.map(function(item) {
      return {
        id: item._id,
        name: item.name,
        province_name: item.province_name,
        slug: item.slug,
        lat: item.lat,
        lng: item.lng
      };
    });
  },
  report: async function({ country_slug, date }) {
    const match = await DailyReport.find({ country_slug }).lean().exec();

    if (!match || !match.length) {
      return null;
    }

    const report = await createEstimationReport(match);

    if (!report) {
      return null;
    }

    return {
      daily: report.daily,
      estimation: {
        curve: report.estimation.curve,
        curve_params: report.estimation.curve_params,
        peak_day_date: report.estimation.peak_day_date,
        peak_day_new_infected: report.estimation.peak_day_new_infected,
        last_day_date: report.estimation.last_day_date,
        total_infected: report.estimation.total_infected,
        upcomming_infected: report.estimation.upcomming_infected,
        total_dead: report.estimation.total_dead,
        upcomming_dead: report.estimation.upcomming_dead,
      },
      recent_total_infected: report.recent_total_infected
    };
  }
};

module.exports = gqlResolvers;
