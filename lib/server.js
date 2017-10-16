const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { db } = require('./adapters/db')
const schema = require('./graphql/schema')
const compression = require('compression')
const os = require('os')
const ifaces = os.networkInterfaces()

const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || 'development'

const app = express()

app.use(cors())
app.use(compression())

const graphqlOptions = {
  schema,
  context: {
    db,
  },
}

/**
 * Routes
 */
app.use('/graphql', bodyParser.json(), graphqlExpress(graphqlOptions))

app.get(
  '/graphiql',
  graphiqlExpress({ endpointURL: '/graphql', editorTheme: 'mdn-like' })
)

app.listen(PORT, () => {
  if (ENV === 'development') {
    console.log(`
    Movies
    ====================
    Listening on port: ${PORT}

    Local: http://localhost:${PORT}/grapihql
    On your network: http://${ifaces.en0[1].address}:${PORT}/graphiql
    `)
  } else {
    console.log(`Listening on port: ${PORT}`)
  }
})
