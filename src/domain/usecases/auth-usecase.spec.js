const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = 'validUser'
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return { sut, loadUserByEmailRepositorySpy }
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw if no password is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth('test.email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const email = 'test.email@email.com'
    await sut.auth(email, 'password')

    expect(loadUserByEmailRepositorySpy.email).toBe(email)
  })

  it('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth('test.email@email.com', 'password')

    expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository')
    )
  })

  it('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const loadUserByEmailRepository = {}
    const sut = new AuthUseCase(loadUserByEmailRepository)

    const promise = sut.auth('test.email@email.com', 'password')

    expect(promise).rejects.toThrow(
      new InvalidParamError('loadUserByEmailRepository')
    )
  })

  it('Should return null if an unregistered email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = undefined

    const accessToken = await sut.auth('invalid.email@email.com', 'password')

    expect(accessToken).toBe(null)
  })

  it('Should return null an invalid password is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = undefined

    const accessToken = await sut.auth(
      'user.email@email.com',
      'invalid_password'
    )

    expect(accessToken).toBe(null)
  })
})
