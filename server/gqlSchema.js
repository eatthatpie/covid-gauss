const gqlSchema = `
  type Country {
    id: String
    name: String
    province_name: String
    slug: String
    lat: Float
    lng: Float
  }

  type DailyReport {
    id: String
    date: String
    new_infected: Int
    total_infected: Int
    new_dead: Int
    total_dead: Int
    new_recovered: Int
    total_recovered: Int
    estimated_new_infected: Int
    estimated_total_infected: Int
  }

  type Estimation {
    curve: String
    curve_params: [Float]
    peak_day_date: String
    peak_day_new_infected: Int
    last_day_date: String
    total_infected: Int
    upcomming_infected: Int
    total_dead: Int
    upcomming_dead: Int
  }

  type Report {
    daily: [DailyReport]
    country: Country
    estimation: Estimation
    has_valid_estimation: Boolean
    max_actual_new_infections_daily: Int
    recent_total_infected: Int
  }

  type Query {
    country(slug: String!): Country
    countries: [Country]
    report(country_slug: String!, date: String): Report
  }
`;

module.exports = gqlSchema;
