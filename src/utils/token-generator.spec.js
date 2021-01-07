const jwt = require('jsonwebtoken')
const MissingParamError = require('./errors/missing-param-error')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
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

  it('Should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()

    const promise = sut.generate('test_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  it('Should throw if no payload is provided', async () => {
    const sut = makeSut()

    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('payload'))
  })
})
