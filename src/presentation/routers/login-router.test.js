class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email) {
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
})
