const {
  getCrew,
  getNames,
  movieLaterals,
  movieSelects,
  findRoleId,
} = require('../helpers')

describe('#getCrew', () => {
  it('should sort crew members correctly', () => {
    const input = [
      { name: 'Darren Aronofsky', job: 'Director' },
      { name: 'Clint Mansell', job: 'Music' },
      { name: 'Clint Mansell', job: 'Original Music Composer' },
      { name: 'Hubert Selby Jr.', job: 'Writing' },
      { name: 'Hubert Selby Jr.', job: 'Writer' },
      { name: 'Darren Aronofsky', job: 'Screenplay' },
      { name: 'Random person', job: 'Grip' },
    ]

    expect(getCrew(input)).toMatchSnapshot()
  })
})

describe('#getNames', () => {
  it('should return names from array items', () => {
    const input = [
      { name: 'Cookie Monster', id: 1 },
      { name: 'Count van Count', id: 2 },
    ]

    expect(getNames(input)).toEqual(['Cookie Monster', 'Count van Count'])
  })
})

describe('#findRoleId', () => {
  it('should return 1 for director', () => {
    expect(findRoleId('director')).toEqual(1)
  })

  it('should return 2 for actor', () => {
    expect(findRoleId('actor')).toEqual(2)
  })

  it('should return 3 for writer', () => {
    expect(findRoleId('writer')).toEqual(3)
  })

  it('should return 4 for composer', () => {
    expect(findRoleId('composer')).toEqual(4)
  })
})

describe('#movieLaterals', () => {
  it('should return a big join for movies', () => {
    expect(movieLaterals).toMatchSnapshot()
  })
})

describe('#movieSelects', () => {
  it('should return common select for movies', () => {
    expect(movieSelects).toMatchSnapshot()
  })
})
