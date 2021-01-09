describe('Main Index', () => {
  it('Should call app lister', async () => {
    jest.mock('./config/app.js', () => ({
      listen (port, callback) {
        if (callback) {
          callback()
        }
      }
    }))
    const mock = jest.requireMock('./config/app')
    const listen = jest.spyOn(mock, 'listen')
    require('./index')
    expect(listen).toHaveBeenCalledTimes(1)
  })
})
