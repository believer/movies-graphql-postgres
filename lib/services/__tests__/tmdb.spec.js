describe('services/tmdb', () => {
  afterEach(() => {
    jest.resetModules()
  })

  describe('#credits', () => {
    it('should resolve with data', async () => {
      jest.mock('moviedb', () =>
        jest.fn().mockImplementation(() => ({
          movieCredits: jest
            .fn()
            .mockImplementationOnce((_, cb) => cb(null, { credits: 'creds' })),
        }))
      )

      const { credits } = require('../tmdb')

      const data = await credits({ title: 'test' })

      expect(data).toEqual({
        credits: 'creds',
      })
    })

    it('should handle errors', async () => {
      jest.mock('moviedb', () =>
        jest.fn().mockImplementation(() => ({
          movieCredits: jest
            .fn()
            .mockImplementationOnce((_, cb) => cb('err', false)),
        }))
      )

      expect.hasAssertions()

      const { credits } = require('../tmdb')

      try {
        await credits({ title: 'test' })
      } catch (e) {
        expect(e).toEqual('err')
      }
    })
  })

  describe('#info', () => {
    it('should resolve with data', async () => {
      jest.mock('moviedb', () =>
        jest.fn().mockImplementation(() => ({
          movieInfo: jest
            .fn()
            .mockImplementationOnce((_, cb) => cb(null, 'information')),
        }))
      )

      const { info } = require('../tmdb')

      const data = await info(1337)

      expect(data).toEqual('information')
    })

    it('should handle errors', async () => {
      jest.mock('moviedb', () =>
        jest.fn().mockImplementation(() => ({
          movieInfo: jest
            .fn()
            .mockImplementationOnce((_, cb) => cb('err', false)),
        }))
      )

      expect.hasAssertions()

      const { info } = require('../tmdb')

      try {
        await info(1337)
      } catch (e) {
        expect(e).toEqual('err')
      }
    })
  })
})
