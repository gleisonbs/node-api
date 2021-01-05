const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorWithError {
    async generate (userId) {
      throw new Error()
    }
  }

  const tokenGeneratorWithError = new TokenGeneratorWithError()
  return tokenGeneratorWithError
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'accessToken'
  return tokenGeneratorSpy
}

const makeEncrypterWithError = () => {
  class EncrypterWithError {
    async compare (password, hashedPassword) {
      throw new Error()
    }
  }

  const encrypterWithError = new EncrypterWithError()
  return encrypterWithError
}

const makeEncrypterSpy = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositoryWithError {
    async load (email) {
      throw new Error()
    }
  }

  const loadUserByEmailRepositoryWithError = new LoadUserByEmailRepositoryWithError()
  return loadUserByEmailRepositoryWithError
}

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password',
    id: 'user_id'
  }
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const encrypterSpy = makeEncrypterSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy }
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

  it('Should throw if no loadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth('test.email@email.com', 'password')

    expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository')
    )
  })

  it('Should throw if no dependency is provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth('test.email@email.com', 'password')

    expect(promise).rejects.toThrow()
  })

  it('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const loadUserByEmailRepository = {}
    const sut = new AuthUseCase({ loadUserByEmailRepository })

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
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const accessToken = await sut.auth(
      'user.email@email.com',
      'invalid_password'
    )

    expect(accessToken).toBe(null)
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()

    const password = 'password'
    await sut.auth('test.email@email.com', 'password')
    expect(encrypterSpy.password).toBe(password)
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    )
  })

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth('test.email@email.com', 'password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('Should return accessToken if valid credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()

    const accessToken = await sut.auth(
      'valid.email@email.com',
      'valid_password'
    )
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  it('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({
        loadUserByEmailRepository: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: null
      })
    ]

    for (const sut of suts) {
      const promise = sut.auth('test.email@email.com', 'password')
      expect(promise).rejects.toThrow()
    }
  })

  it('Should throw if dependency throws', async () => {
    const suts = [
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: makeEncrypterSpy(),
        tokenGenerator: makeTokenGeneratorWithError()
      })
    ]

    for (const sut of suts) {
      const promise = sut.auth('test.email@email.com', 'password')
      expect(promise).rejects.toThrow()
    }
  })
})
