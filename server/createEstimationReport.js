const gaussFit = require('./gaussFit');

async function createEstimationReport(dailyReports) {
  let lastDoubleZeroIndex = 0;

  dailyReports.forEach(function(item, i) {
    if (i > 0 && dailyReports[i].new_infected === 0 && dailyReports[i - 1].new_infected === 0 && dailyReports[i].total_infected < 100) {
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

  const curveParams = await gaussFit(Object.keys(yData), yData);

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
      estimated_total_infected: estimatedTotalInfected
    });
  });

  const lastRealDailyReport = valuableData[valuableData.length - 1];
  let totalInfected = lastRealDailyReport.total_infected;
  let i = valuableData.length;
  let curr;

  let dt = new Date(lastRealDailyReport.date).getTime();

  while ((curr = Math.round(curveFn(i))) > 0) {
    totalInfected += curr;
    dt += 24 * 60 * 60 * 1000;
    
    const d = new Date(dt);

    valuableData.push({
      estimated_new_infected: curr,
      estimated_total_infected: totalInfected,
      date: `${d.getUTCFullYear()}-0${d.getMonth() + 1}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()}`
    });

    i++;
  }

  const lasyDailyReport = valuableData[valuableData.length - 1];
  const medianDailyReport = valuableData[Math.round(valuableData.length / 2)];

  return {
    daily: valuableData,
    estimation: {
      curve: 'gauss',
      curve_params: curveParams,
      peak_day_date: medianDailyReport.date,
      peak_day_new_infected: medianDailyReport.estimated_new_infected,
      last_day_date: lasyDailyReport.date,
      total_infected: totalInfected,
      upcomming_infected: totalInfected - lastRealDailyReport.total_infected,
      total_dead: null,
      upcomming_dead: null
    },
    recent_total_infected: lastRealDailyReport.total_infected
  };
}

module.exports = createEstimationReport;
