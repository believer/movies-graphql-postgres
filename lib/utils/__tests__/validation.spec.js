const {
  validEmail,
} = require('../validation')

describe('utils/validation', () => {
  describe('#validEmail', () => {
    it('should contain an at', () => {
      expect(validEmail('batmanthecave.org')).toEqual(false)
    })

    it('should contain an domain with atleast two characters', () => {
      expect(validEmail('batman@thecave.o')).toEqual(false)
    })
  })
})
