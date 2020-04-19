function makeQuery(query, variables) {
  return (
    fetch('https://datapi.covid-gauss.site/gqltest', {
        method: 'POST',
        body: JSON.stringify({ query, variables }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
    .then(response => response.json())
    .then(response => response.data)
    .catch(function(e) {
      console.error(e)
    })
  )
}

const queryAllCountries = `{
  countries {
    name
    province_name
    slug
  }
}`

const queryReport = `
  query queryReport($slug: String!) {
    report(country_slug: $slug) {
      country {
        name
      }
      estimation {
        last_day_date
        upcomming_infected
        curve_peak_day_date
        curve_peak_day_new_infected
        curve_params
        total_infected
      }
      daily {
        date
        new_infected
        estimated_new_infected
      }
      has_valid_estimation
      max_actual_new_infections_daily
      recent_total_infected
    }
  }
`

const queryHistoricalReport = `
  query queryHistoricalReport($slug: String!, $date: String!) {
    report(country_slug: $slug, date: $date) {
      estimation {
        last_day_date
        upcomming_infected
        curve_peak_day_date
        curve_peak_day_new_infected
        total_infected
      }
      has_valid_estimation
      recent_total_infected
    }
  }
`

export { makeQuery, queryAllCountries, queryHistoricalReport, queryReport }
