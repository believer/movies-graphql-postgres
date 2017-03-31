const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const loadGqlFiles = require('./build/fileLoader')

const path = require('path').resolve(__dirname, './**/*.graphql')

module.exports = loadGqlFiles(path)
  .then(typeDefs =>
    makeExecutableSchema({
      typeDefs,
      resolvers
    }))
