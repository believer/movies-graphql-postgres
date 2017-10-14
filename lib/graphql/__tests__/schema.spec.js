require('../schema')
const { makeExecutableSchema, } = require('graphql-tools')

describe('#schema', () => {
  it('should set type definitions', () => {
    expect(makeExecutableSchema.mock.calls[0][0].typeDefs).toMatchSnapshot()
  })

  it('should set resolvers', () => {
    expect(makeExecutableSchema.mock.calls[0][0].resolvers).toMatchSnapshot()
  })
})
