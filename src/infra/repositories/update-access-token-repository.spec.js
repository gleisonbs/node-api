const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let userModel

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessToken Repository', () => {
  let userId
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
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
    const sut = makeSut()

    await sut.update(userId, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: userId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  it('Should throw if no params are provided', async () => {
    const sut = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(userId)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
