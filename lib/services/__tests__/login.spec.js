const login = require('../login')
const crypto = require('crypto')

jest.mock('crypto', () => ({
  createHmac: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue('updatedPw'),
    digest: jest.fn().mockReturnValue('hashedDbPassword'),
  }),
  randomBytes: jest.fn().mockReturnValue('thisissalt'),
}))

describe('services/login', () => {
  describe('#invalidPassword', () => {
    it('should call createHmac with correct parameters', () => {
      login.invalidPassword(
        'robin4ever',
        'hashedDbPassword',
        'thisisalongsaltstring'
      )

      expect(crypto.createHmac).toHaveBeenCalledWith(
        'sha512',
        'thisisalongsaltstring'
      )
    })

    it('should call update with correct parameters', () => {
      login.invalidPassword('robin4ever', 'hashedDbPassword', 'thisissalt')

      expect(crypto.createHmac().update).toHaveBeenCalledWith('robin4ever')
    })

    it('should call digest with correct parameters', () => {
      login.invalidPassword('robin4ever', 'hashedDbPassword', 'thisissalt')

      expect(crypto.createHmac().digest).toHaveBeenCalledWith('hex')
    })

    it('returns true if password dont match', () => {
      crypto.createHmac().digest.mockReturnValue('nope')

      expect(
        login.invalidPassword('robin4ever', 'hashedDbPassword', 'thisissalt')
      ).toEqual(true)
    })

    it('returns false if password match', () => {
      crypto.createHmac().digest.mockReturnValue('hashedDbPassword')

      expect(
        login.invalidPassword('robin4ever', 'hashedDbPassword', 'thisissalt')
      ).toEqual(false)
    })
  })

  describe('#saltAndHasPassword', () => {
    it('calls randomsBytes to generate salt', () => {
      login.saltAndHashPassword('batman4ever')

      expect(crypto.randomBytes).toHaveBeenCalledWith(256)
    })
  })
})
