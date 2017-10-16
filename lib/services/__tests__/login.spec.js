const login = require('../login')

xdescribe('#movie', () => {
  it('should get movie information', () => {
    login.invalidPassword('tt1333337')

    expect(tmdb.info).toHaveBeenCalledWith('tt1333337')
  })
})
