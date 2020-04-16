const downloadCsv = require('./lib/downloadCsv');
const forEach = require('./lib/forEach');
const slugify = require('slugify');
const { Country, DailyReport } = require('../server/models');

const BASE_DATA_SOURCE_URL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
const INFECTED_DATA_SOURCE_URL = BASE_DATA_SOURCE_URL + 'time_series_covid19_confirmed_global.csv';
const DEAD_DATA_SOURCE_URL = BASE_DATA_SOURCE_URL + 'time_series_covid19_deaths_global.csv';
const RECOVERED_DATA_SOURCE_URL = BASE_DATA_SOURCE_URL + 'time_series_covid19_recovered_global.csv';

function createMappedData(raw, fieldName) {
  let countries = {};
  let dailyReports = {};

  const [headers, ...rows] = raw;
  const [provinceHeader, countryHeader, latHeader, lngHeader, ...dates] = headers;
  
  forEach(rows, function(row) {
    const [provinceName, countryName, lat, lng, ...values] = row;

    const countryFullName = (countryName + ' ' + provinceName).trim();
    const slug = slugify(countryFullName, { lower: true, remove: /[*+~.()'"!:@]/g });

    countries[countryFullName] = {
      name: countryName,
      province_name: provinceName || null,
      slug: slug,
      lat: lat,
      lng: lng
    };

    forEach(values, function(value, i) {
      const date = dates[i];
      const previousValue = i > 0 ? values[i - 1] : 0;

      if (!dailyReports.hasOwnProperty(countryFullName)) {
        dailyReports[countryFullName] = {
          [date]: {
            country_slug: slug,
            date: date,
            date_obj: new Date(date + ' UTC'),
            ['new_' + fieldName]: value - previousValue,
            ['total_' + fieldName]: value
          }
        };
      } else {
        dailyReports[countryFullName][date] = {
          country_slug: slug,
          date: date,
          date_obj: new Date(date + ' UTC'),
          ['new_' + fieldName]: value - previousValue,
          ['total_' + fieldName]: value
        };
      }      
    });
  });

  return { countries, dailyReports };
}

(async function() {
  try {
    const infected = await downloadCsv(INFECTED_DATA_SOURCE_URL);
    const dead = await downloadCsv(DEAD_DATA_SOURCE_URL);
    const recovered = await downloadCsv(RECOVERED_DATA_SOURCE_URL);

    const mappedInfected = createMappedData(infected, 'infected');
    const mappedDead = createMappedData(dead, 'dead');
    const mappedRecovered = createMappedData(recovered, 'recovered');

    const countries = Object.assign(
      mappedInfected.countries,
      mappedDead.countries,
      mappedRecovered.countries
    );

    let dailyReports = {};

    Object.keys(mappedInfected.dailyReports).forEach(key => {
      dailyReports[key] = {};

      Object.keys(mappedInfected.dailyReports[key]).forEach(date => {
        if (!dailyReports.hasOwnProperty(key)) {
          dailyReports[key] = {
            [date]: Object.assign(
              mappedInfected.dailyReports[key][date],
              mappedDead.dailyReports[key][date],
              mappedRecovered.dailyReports[key] 
                ? mappedRecovered.dailyReports[key][date]
                : {}
            )
          };
        } else {
          dailyReports[key][date] = Object.assign(
            mappedInfected.dailyReports[key][date],
            mappedDead.dailyReports[key][date],
            mappedRecovered.dailyReports[key] 
              ? mappedRecovered.dailyReports[key][date]
              : {}
          );
        }
      });
    });

    let bulkDailyReports = [];

    Object.values(dailyReports).forEach(country => {
      Object.values(country).forEach(report => {
        bulkDailyReports.push({
          updateOne: {
            filter: { country_slug: report.country_slug, date: report.date },
            update: report,
            upsert: true
          }
        });
      });  
    });

    const bulkCountries = Object.values(countries).map(function(item) {
      return {
        updateOne: {
          filter: { slug: item.slug },
          update: item,
          upsert: true
        }
      };
    });

    console.log('Import done. Countries bulk write...');

    await Country.bulkWrite(bulkCountries);

    console.log('Countries bulk write done. Daily reports bulk write...');

    await DailyReport.bulkWrite(bulkDailyReports);

    console.log('Writing done.');

    const used = process.memoryUsage();

    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
  } catch (e) {
    console.log(e);
  }
})().then(() => process.exit(0));
