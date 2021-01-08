const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { userModel, sut }
}

describe('UpdateAccessToken Repository', () => {
  let userId
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    const userModel = db.collection('users')
    await userModel.deleteMany()
    const insertedUser = await userModel.insertOne({
      email: 'test.email@email.com'
    })
    userId = insertedUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()
    await sut.update(userId, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: userId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  it('Should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update(userId, 'valid_token')

    expect(promise).rejects.toThrow(new MissingParamError('userModel'))
  })

  it('Should throw if no params are provided', async () => {
    const { sut } = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(userId)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
