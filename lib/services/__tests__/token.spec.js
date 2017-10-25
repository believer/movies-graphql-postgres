const { issueToken, verifyToken } = require('../token')
const jwt = require('jsonwebtoken')
const nconf = require('nconf')

jest.mock('nconf', () => ({
  env: jest.fn().mockReturnValue({
    file: jest.fn().mockReturnValue({}),
  }),
  get: jest.fn().mockReturnValue('sikrit'),
}))

describe('services/token', () => {
  describe('#issueToken', () => {
    it('should called jwt library', () => {
      issueToken({ name: 'Cookie Monster' })

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          data: {
            user: {
              name: 'Cookie Monster',
            },
          },
        },
        'sikrit',
        {
          algorithm: 'HS512',
          expiresIn: '1h',
        }
      )
    })

    it('should return a signed token', () => {
      const result = issueToken({ name: 'Cookie Monster' })

      expect(result).toEqual('token')
    })
  })

  describe('#verifyToken', () => {
    it('should called jwt library', async () => {
      try {
        jwt.verify.mockReturnValue({
          data: {
            user: {
              id: 'cookies',
            },
          },
        })

        await verifyToken('Bearer 1234')

        expect(jwt.verify).toHaveBeenCalledWith('1234', 'sikrit')
      } catch (e) {
        throw new Error(e)
      }
    })

    it('should return a signed token', async () => {
      try {
        jwt.verify.mockReturnValue({
          data: {
            user: {
              id: 'cookies',
            },
          },
        })

        const result = await verifyToken('Bearer 1234')

        expect(result).toEqual({
          id: 'cookies',
        })
      } catch (e) {
        throw new Error(e)
      }
    })

    it('should handle errors', async () => {
      try {
        jwt.verify.mockImplementation(() => Promise.reject('err'))

        const result = await verifyToken('Bearer 1234')

        expect(result).toEqual({
          id: 'cookies',
        })
      } catch (e) {
        expect(e.message).toEqual('err')
      }
    })
  })
})
