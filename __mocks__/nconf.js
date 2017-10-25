module.exports = {
  env: jest.fn().mockReturnThis(),
  file: jest.fn().mockReturnThis(),
  get: jest.fn(input => input),
}