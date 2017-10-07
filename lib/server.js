const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const schema = require('./graphql/schema')

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())

const graphqlOptions = { schema }

/**
 * Routes
 */
app.get('/graphql', graphqlExpress(graphqlOptions))
app.post('/graphql', bodyParser.json(), graphqlExpress(graphqlOptions))

app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
