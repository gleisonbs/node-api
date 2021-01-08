const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe('LoadUserByEmail Repositoty', () => {
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

  it('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid.email@email.com')
    expect(user).toBeNull()
  })

  it('Should return user if an user is found', async () => {
    const { sut, userModel } = makeSut()
    const email = 'valid.email@email.com'

    const userInserted = await userModel.insertOne({
      email,
      name: 'test_user',
      age: 50,
      state: 'test_state',
      password: 'hashed_password'
    })
    const userRetrieved = await sut.load(email)

    expect(userRetrieved).toEqual({
      _id: userInserted.ops[0]._id,
      password: userInserted.ops[0].password
    })
  })

  it('Should throw if no userModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()

    const promise = sut.load('test.email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('userModel'))
  })

  it('Should throw if userModel has no findOne method', async () => {
    const sut = new LoadUserByEmailRepository({})

    const promise = sut.load('test.email@email.com')
    expect(promise).rejects.toThrow(new InvalidParamError('userModel'))
  })

  it('Should throw if email is not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})