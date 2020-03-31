var { buildSchema } = require('graphql');
var graphqlHTTP = require('express-graphql');

var schema = buildSchema(`
  type Country {
    id: String
    name: String
    province_name: String
    slug: String
    lat: Float
    lng: Float
  }

  type Query {
    country(slug: String!): Country
    countries: [Country]
  }
`);

var rootValue = {
  country: async function({ slug }) {
    return {
      id: '1',
      name: 'Poland',
      province_name: null,
      slug: 'poland',
      lat: 12.345,
      lng: 13.456
    }
  }
};

function createGqlServer(app) {
  app.use(graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  }));
}

module.exports = createGqlServer;
