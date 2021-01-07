const jwt = require('jsonwebtoken')

const makeSut = () => {
  class TokenGenerator {
    constructor (secret) {
      this.secret = secret
    }

    async generate (payload) {
      return jwt.sign(payload, this.secret)
    }
  }
  return new TokenGenerator('secret')
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

  it('Should call JWT with correct values', async () => {
    const sut = makeSut()

    await sut.generate('test_id')
    expect(jwt.payload).toBe('test_id')
    expect(jwt.secretOrPrivateKey).toBe(sut.secret)
  })
})
