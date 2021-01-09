const sut = require('./mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if getCollection() is invoked and client is diconnected', async () => {
    expect(sut.db).toBeTruthy()

    await sut.disconnect()
    expect(sut.db).toBeFalsy()

    await sut.getCollection('test')
    expect(sut.db).toBeTruthy()
  })
})
