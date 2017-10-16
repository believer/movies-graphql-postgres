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

nconf.env({ lowerCase: true }).file({ file: `${process.cwd()}/config.json` })

const PORT = nconf.get('port') || 3000
const ENV = nconf.get('environment') || 'development'

const app = express()

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

    Local: http://localhost:${PORT}/grapihql
    On your network: http://${ifaces.en0[1].address}:${PORT}/graphiql
    `)
  } else {
    console.log(`Listening on port: ${PORT}`)
  }
})
