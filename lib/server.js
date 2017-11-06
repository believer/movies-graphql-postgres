const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { db } = require('./adapters/db')
const schema = require('./graphql/schema')
const compression = require('compression')
const os = require('os')
const ifaces = os.networkInterfaces()
const nconf = require('nconf')
const { Engine } = require('apollo-engine')

nconf
  .env({ separator: '__', lowerCase: true })
  .file({ file: `${process.cwd()}/config.json` })

const PORT = nconf.get('port') || 3000
const ENV = nconf.get('environment') || 'development'

const app = express()

if (ENV !== 'development') {
  // Setup Apollo Engine
  const engine = new Engine({
    engineConfig: {
      apiKey: nconf.get('apollo:apikey'),
      stores: [
        {
          name: 'embeddedCache',
          inMemory: {
            cacheSize: 10485760,
          },
        },
      ],
      queryCache: {
        publicFullQueryStore: 'embeddedCache',
        privateFullQueryStore: 'embeddedCache',
      },
    },
    graphqlPort: PORT,
  })
  engine.start()
  app.use(engine.expressMiddleware())
}

app.use(cors())
app.use(compression())

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      context: {
        db,
        token: req.header('authorization'),
      },
      tracing: true,
      cacheControl: true,
    }
  })
)

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

    Local: http://localhost:${PORT}/graphiql
    On your network: http://${ifaces.en0[1].address}:${PORT}/graphiql
    `)
  } else {
    console.log(`Listening on port: ${PORT}`)
  }
})
