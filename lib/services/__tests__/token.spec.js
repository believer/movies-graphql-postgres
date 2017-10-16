const { issueToken, verifyToken } = require('../token')
const jwt = require('jsonwebtoken')

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
    it('should called jwt library', () => {
      verifyToken('token')

      expect(jwt.verify).toHaveBeenCalledWith('token', 'sikrit')
    })

    it('should return a signed token', () => {
      jwt.verify.mockReturnValue(true)

      const result = verifyToken({ name: 'Cookie Monster' })

      expect(result).toEqual(true)
    })
  })
})
