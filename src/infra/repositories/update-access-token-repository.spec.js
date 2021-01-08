const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!this.userModel) {
      throw new MissingParamError('userModel')
    }

    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          accessToken
        }
      }
    )
  }
}

describe('UpdateAccessToken Repository', () => {
  let db
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should update the user with the given accessToken', async () => {
    const userModel = db.collection('users')

    const userInserted = await userModel.insertOne({
      email: 'test.email@email.com',
      name: 'test_user',
      age: 50,
      state: 'test_state',
      password: 'hashed_password'
    })

    const sut = new UpdateAccessTokenRepository(userModel)
    const userId = userInserted.ops[0]._id
    await sut.update(userId, 'valid_token')

    const updatedUser = await userModel.findOne({ _id: userId })

    expect(updatedUser.accessToken).toBe('valid_token')
  })

  it('Should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()

    const userModel = db.collection('users')
    const userInserted = await userModel.insertOne({
      email: 'test.email@email.com',
      name: 'test_user',
      age: 50,
      state: 'test_state',
      password: 'hashed_password'
    })

    const promise = sut.update(userInserted.ops[0]._id, 'valid_token')

    expect(promise).rejects.toThrow(new MissingParamError('userModel'))
  })
})
