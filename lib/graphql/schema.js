const { makeExecutableSchema } = require('graphql-tools')
const reqdir = require('require-dir')
const Mutation = reqdir('./resolvers/mutations')
const Query = reqdir('./resolvers/queries')

const typeDefs = `
  interface MovieInterface {
    actors: [String]
    backdrop: String
    countries: [String]
    directors: [String]
    genres: [String]
    id: String
    imdb_id: String
    languages: [String]
    composers: [String]
    title: String
    production_companies: [String]
    poster: String
    release_date: String
    synopsis: String
    runtime: Int
    tagline: String
    title: String
    tmdb_id: String
    wilhelm: Boolean
    writers: [String]
    year: String
  }

  type Movie implements MovieInterface {
    actors: [String]
    backdrop: String
    countries: [String]
    directors: [String]
    genres: [String]
    id: String
    imdb_id: String
    languages: [String]
    composers: [String]
    title: String
    production_companies: [String]
    poster: String
    release_date: String
    synopsis: String
    runtime: Int
    tagline: String
    title: String
    tmdb_id: String
    wilhelm: Boolean
    writers: [String]
    year: String
  }

  type MovieWithUser implements MovieInterface {
    actors: [String]
    backdrop: String
    countries: [String]
    directors: [String]
    genres: [String]
    id: String
    imdb_id: String
    languages: [String]
    composers: [String]
    title: String
    production_companies: [String]
    poster: String
    release_date: String
    synopsis: String
    runtime: Int
    tagline: String
    title: String
    tmdb_id: String
    user: User
    wilhelm: Boolean
    writers: [String]
    year: String
  }

  type ViewDate {
    date: String
    userId: Int
  }

  type View {
    movie_id: Int
    title: String
    dates: [ViewDate]
    views_count: Int
  }

  enum PersonType {
    actor
    composer
    director
    writer
  }

  input RatingInput {
    userId: Int!
    # ID in DB
    movieId: String!
    # New rating
    rating: Int!
  }

  input MovieInput {
    userId: Int!
    # IMDb ID or IMDb URL
    imdbId: String!
    rating: Int = 0
    # View date
    date: String
    # The famous Wilhelm Scream
    wilhelm: Boolean = false
  }

  type UpdatedRating {
    movie_id: Int
    rating: Int
  }

  type CountWithYear {
    count: Int
    year: String
  }

  type PersonInMovies {
    name: String
    number_of_movies: Int
    ranking: Int
  }

  type Watches {
    views_with_rewatches: Int
    total_views: Int
  }

  type Runtime {
    days: Int
    minutes: Int
    hours: Int
    years: Float
  }

  type RuntimeWithAdjusted {
    total_with_rewatches: Runtime
    total: Runtime
  }

  type Ratings {
    rating: Int
    user: User
  }

  type User {
    email: String
    id: Int
    name: String
  }

  # The allowed mutations
  type Mutation {
    insertMovie(input: MovieInput!): Movie
    updateRating(input: RatingInput!): Movie
  }

  type Query {
    # Return a feed of all users watches or
    # if provided with an ID only one users feed
    feed(userId: Int, limit: Int = 50, offset: Int = 0): [MovieWithUser]!

    # Takes an required ID that can be either
    # the ID in the database OR an IMDb ID (i.e. tt0180093)
    movie(id: String!): Movie
    movies(limit: Int = 50, offset: Int = 0): [Movie]
    bestForYears(userId: Int!, ranking: Int!): [Movie]
    moviesPerYear(year: String): [CountWithYear]
    moviesWithRating(rating: Int!): [Movie]
    person(name: String!, role: PersonType!): [Movie]

    # All users ratings for a specific movie
    ratings(movieId: Int!): [Ratings]!
    totalByPerson(
      userId: Int!
      role: PersonType!
      ranked: Int = 10
      name: String
    ): [PersonInMovies]
    totalByRole(userId: Int!, role: PersonType!): Int
    users(id: Int): [User]!
    userMoviesPerYear(userId: Int!): [CountWithYear]

    # Total amounts of time spent watching movies,
    # both for single views and adjusted with rewatches
    userRuntime(userId: Int!): RuntimeWithAdjusted
    views(userId: Int, offset: Int = 0, limit: Int = 10): [View]
    watches(userId: Int!): Watches
  }
`

const resolvers = {
  Mutation,
  Query,
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
})
