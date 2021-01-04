const LoginRouter = require('./login-router')
const {
  MissingParamError,
  InvalidParamError,
  ServerError,
  UnauthorizedError
} = require('../helpers/errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'dummy_token'

  const emailValidatorSpy = makeEmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return { sut, authUseCaseSpy, emailValidatorSpy }
}

const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'dummy_token'
  return authUseCaseSpy
}

const makeAuthUseCaseSpyWithError = () => {
  class AuthUseCaseSpyWithError {
    async auth () {
      throw new Error()
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpyWithError()
  return authUseCaseSpy
}

const makeEmailValidatorSpy = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  return new EmailValidatorSpy()
}

const makeEmailValidatorSpyWithError = () => {
  class EmailValidatorSpyWithError {
    isValid (email) {
      throw new Error()
    }
  }
  return new EmailValidatorSpyWithError()
}

describe('Login Router', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false

    const httpRequest = {
      body: {
        email: 'dummy_email_email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  it('Should return 500 if no AuthUseCase is passed to LoginRouter', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if AuthUseCase has no auth method', async () => {
    const authUseCase = {}
    const sut = new LoginRouter(authUseCase)
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if no EmailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    authUseCaseSpy.accessToken = 'dummy_token'
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    authUseCaseSpy.accessToken = 'dummy_token'
    const emailValidatorSpy = {}
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if AuthUseCase throws an error', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpyWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator throws an error', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const emailValidatorSpyWithError = makeEmailValidatorSpyWithError()

    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpyWithError)
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call EmailValidator.isValid with correct params', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com',
        password: 'dummy_password'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
