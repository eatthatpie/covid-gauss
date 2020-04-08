function makeQuery(query, variables) {
  return (
    fetch('https://datapi.covid-gauss.site/gql/', {
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
        peak_day_date
        peak_day_new_infected
        total_infected
      }
      daily {
        date
        new_infected
        estimated_new_infected
      }
      recent_total_infected
    }
  }
`

export { makeQuery, queryAllCountries, queryReport }
