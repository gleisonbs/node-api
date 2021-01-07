const jwt = require('jsonwebtoken')

const makeSut = () => {
  class TokenGenerator {
    async generate (payload) {
      return jwt.sign(payload, 'secretOrPrivateKey')
    }
  }
  return new TokenGenerator()
}

describe('Token Generator ', () => {
  it('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null

    const token = await sut.generate('test_id')
    expect(token).toBe(null)
  })

  it('Should return a token if JWT returns a token', async () => {
    const sut = makeSut()

    const token = await sut.generate('test_id')
    expect(token).toBe(jwt.token)
  })
})
