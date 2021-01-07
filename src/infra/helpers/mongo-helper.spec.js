const MongoHelper = require('./mongo-helper')

describe('Mongo Helper', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should reconnect if getDb() is invoked and client is diconnected', async () => {
    const sut = MongoHelper

    await sut.connect(process.env.MONGO_URL)
    expect(sut.db).toBeTruthy()

    await sut.disconnect()
    expect(sut.db).toBeFalsy()

    await sut.getDb()
    expect(sut.db).toBeTruthy()
  })
})
