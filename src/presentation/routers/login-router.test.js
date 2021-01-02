const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const ServerError = require('../helpers/server-error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'dummy_token'
  const sut = new LoginRouter(authUseCaseSpy)
  return { sut, authUseCaseSpy }
}

const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
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
  class AuthUseCaseSpy {
    auth () {
      throw new Error()
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  return authUseCaseSpy
}

describe('Login Router', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'dummy_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'dummy_email@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
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
    sut.route(httpRequest)
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
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {

        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
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
    const httpResponse = sut.route(httpRequest)
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
    const httpResponse = sut.route(httpRequest)
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
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
