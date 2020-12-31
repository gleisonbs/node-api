class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login Router', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'dummy_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('Should return 400 if no password is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'dummy_email'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
