const { createServer, bodyParser, queryParser } = require('restify')
const { graphqlRestify, graphiqlRestify } = require('graphql-server-restify')
const cors = require('cors')
const buildSchema = require('./graphql/schema')

const app = createServer()
const PORT = process.env.PORT || 3000

buildSchema.then(schema => {
  app.use(cors())
  app.use(bodyParser())
  app.use(queryParser())

  const graphqlOptions = { schema }
  
  app.get('/graphql', graphqlRestify(graphqlOptions))
  app.post('/graphql', graphqlRestify(graphqlOptions))
  app.get('/graphiql', graphiqlRestify({ endpointURL: '/graphql' }))

  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
})

