const movieSimplify = require('../movieSimplify')
const mockdate = require('mockdate')

describe('#movieSimplify', () => {
  afterEach(() => {
    mockdate.reset()
  })

  it('should simplify a movies structure', async () => {
    mockdate.set(1507536210000)

    const movie = {
      backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
      genres: [
        {
          id: 18,
          name: 'Drama',
        },
      ],
      id: 550,
      imdb_id: 'tt0137523',
      original_title: 'Fight Club',
      overview:
        'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
      poster_path: null,
      production_companies: [
        {
          name: '20th Century Fox',
          id: 25,
        },
      ],
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States of America',
        },
      ],
      release_date: '1999-10-12',
      runtime: 139,
      spoken_languages: [
        {
          iso_639_1: 'en',
          name: 'English',
        },
      ],
      tagline:
        'How much can you know about yourself if you\'ve never been in a fight?',
      title: 'Fight Club',
      cast: [
        {
          cast_id: 4,
          character: 'The Narrator',
          credit_id: '52fe4250c3a36847f80149f3',
          gender: 2,
          id: 819,
          name: 'Edward Norton',
          order: 0,
          profile_path: '/eIkFHNlfretLS1spAcIoihKUS62.jpg',
        },
        {
          cast_id: 5,
          character: 'Tyler Durden',
          credit_id: '52fe4250c3a36847f80149f7',
          gender: 2,
          id: 287,
          name: 'Brad Pitt',
          order: 1,
          profile_path: '/kc3M04QQAuZ9woUvH3Ju5T7ZqG5.jpg',
        },
      ],
      crew: [
        {
          credit_id: '56380f0cc3a3681b5c0200be',
          department: 'Writing',
          gender: 0,
          id: 7469,
          job: 'Screenplay',
          name: 'Jim Uhls',
          profile_path: null,
        },
      ],
    }

    try {
      const simplified = await movieSimplify(movie)

      expect(simplified).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })
})
