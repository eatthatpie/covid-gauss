const gaussFit = require('./gaussFit');

/**
 * @TODO
 * This baby needs some refactoring.
 */
async function createEstimationReport(dailyReports) {
  let lastDoubleZeroIndex = 0;

  dailyReports.forEach(function(item, i) {
    if (
      i > 0 && dailyReports[i].new_infected === 0 &&
      dailyReports[i - 1].new_infected === 0 &&
      dailyReports[i].total_infected < 100
    ) {
      lastDoubleZeroIndex = i;
    }
  });

  let valuableData = [];
  
  if (lastDoubleZeroIndex < dailyReports.length - 1) {
    valuableData = dailyReports.slice(lastDoubleZeroIndex + 1);
  }

  let yData = valuableData.map(function(item) {
    return item.new_infected;
  });

  const maxActualNewInfectionsDaily = Math.max(...yData);

  let curveParams;

  try {
    curveParams = await gaussFit(Object.keys(yData), yData);
  } catch (e) {
    valuableData = valuableData.map(function(item, i) {
      return Object.assign({}, item, {
        id: item._id,
        estimated_new_infected: null,
        estimated_total_infected: null,
        date: new Date(item.date + ' UTC').toString()
      });
    });

    const lastRealDailyReport = valuableData[valuableData.length - 1];

    return {
      daily: valuableData,
      estimation: {
        curve: 'gauss',
        curve_params: null,
        peak_day_date: null,
        peak_day_new_infected: null,
        curve_peak_day_date: null,
        curve_peak_day_new_infected: null,
        last_day_date: null,
        total_infected: null,
        upcomming_infected: null,
        total_dead: null,
        upcomming_dead: null
      },
      has_valid_estimation: false,
      max_actual_new_infections_daily: maxActualNewInfectionsDaily,
      recent_total_infected: lastRealDailyReport.total_infected
    };
  }

  function curveFn(x) {
    return curveParams[0] * Math.exp(-(x - curveParams[1])*(x - curveParams[1]) / (2 * curveParams[2] * curveParams[2]));
  }

  let estimatedTotalInfected = 0;

  valuableData = valuableData.map(function(item, i) {
    const estimatedNewInfected = Math.round(curveFn(i));
    estimatedTotalInfected += estimatedNewInfected;

    return Object.assign({}, item, {
      id: item._id,
      estimated_new_infected: estimatedNewInfected,
      estimated_total_infected: estimatedTotalInfected,
      date: new Date(item.date + ' UTC').toString()
    });
  });

  const lastRealDailyReport = valuableData[valuableData.length - 1];
  let totalInfected = lastRealDailyReport.total_infected;
  let i = valuableData.length;
  let curr;

  let dt = new Date(lastRealDailyReport.date + ' UTC');

  while ((curr = Math.round(curveFn(i))) > 0) {
    totalInfected += curr;

    dt.setDate(dt.getDate() + 1);

    const d = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));

    valuableData.push({
      estimated_new_infected: curr,
      estimated_total_infected: totalInfected,
      date: d.toString()
    });

    i++;
  }

  const lasyDailyReport = valuableData[valuableData.length - 1];
  const medianDailyReport = valuableData[Math.round(valuableData.length / 2)];
  const curvePeakDay = valuableData.reduce(function (prev, curr) {
    if (!prev) {
      return curr;
    }

    if (prev.estimated_new_infected < curr.estimated_new_infected) {
      return curr;
    }

    return prev;
  });

  return {
    daily: valuableData,
    estimation: {
      curve: 'gauss',
      curve_params: curveParams,
      peak_day_date: medianDailyReport.date,
      peak_day_new_infected: medianDailyReport.estimated_new_infected,
      curve_peak_day_date: curvePeakDay.date,
      curve_peak_day_new_infected: curvePeakDay.estimated_new_infected,
      last_day_date: lasyDailyReport.date,
      total_infected: totalInfected,
      upcomming_infected: totalInfected - lastRealDailyReport.total_infected,
      total_dead: null,
      upcomming_dead: null
    },
    has_valid_estimation: true,
    max_actual_new_infections_daily: maxActualNewInfectionsDaily,
    recent_total_infected: lastRealDailyReport.total_infected
  };
}

module.exports = createEstimationReport;
