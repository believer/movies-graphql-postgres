const crews = {
  Director: () => 'director',
  Writing: () => 'writer',
  Screenplay: () => 'writer',
  Writer: () => 'writer',
  Music: () => 'music',
  'Original Music Composer': () => 'music'
}

/**
 * Collect the crew members of a movie
 * @param  {string} job - Type of job
 * @return {[type]} [description]
 */
function findCrew (job) {
  const crew = crews[job]
  return crew ? crew() : null
}

function getCrew (data) {
  const crew = {
    director: [],
    writer: [],
    music: []
  }

  data.forEach(person => {
    var crewType = findCrew(person.job)
    if (crewType) { crew[crewType].push(person.name) }
  })

  return crew
}

const getNames = (array) => array.map(arr => arr.name)

const findRoleId = (role) => {
  switch (role) {
    case 'director':
      return 1
    case 'actor':
      return 2
    case 'writer':
      return 3
    case 'composer':
      return 4
  }
}

module.exports = {
  getCrew,
  getNames,
  findRoleId
}
