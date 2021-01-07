const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

describe('LoadUserByEmail Repositoty', () => {
  let connection
  let db
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await connection.close()
  })

  it('Should return null if no user is found', async () => {
    const userModel = await db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('invalid.email@email.com')
    expect(user).toBeNull()
  })

  it('Should return user if an user is found', async () => {
    const userModel = await db.collection('users')
    const email = 'valid.email@email.com'
    await userModel.insertOne({ email })

    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load(email)
    expect(user.email).toBe(email)
  })
})
