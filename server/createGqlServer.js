var cors = require('cors');
var graphqlHTTP = require('express-graphql');
var gqlResolvers = require('./gqlResolvers');
var gqlSchema = require('./gqlSchema');
var { buildSchema } = require('graphql');

var schema = buildSchema(gqlSchema);

function createGqlServer(app) {
  app.use(cors());
  app.use(graphqlHTTP({
    schema,
    rootValue: gqlResolvers,
    graphiql: process.env.NODE_ENV === 'dev'
  }));
}

module.exports = createGqlServer;
