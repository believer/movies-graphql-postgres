const readFile = require('fs-readfile-promise')
const glob = require('glob-promise')

const getFiles = (files) =>
  Promise
    .all(files.map(file => readFile(file, 'utf-8')))
    .then(fileArray => fileArray.join())

module.exports = (pattern) =>
  glob(pattern)
    .then(getFiles)
    .catch((err) => {
      throw err
    })
