const MissingParamError = require('./errors/missing-param-error')
const Encrypter = require('./encrypter')
const bcrypt = require('bcrypt')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  it('Should return false if bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()

    await sut.compare('value', 'hashed_value')
    expect(bcrypt.value).toBe('value')
    expect(bcrypt.hashedValue).toBe('hashed_value')
  })

  it('Should throw if called with incorrect number of parameters', async () => {
    const sut = makeSut()

    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('value')).rejects.toThrow(new MissingParamError('hashedValue'))
  })
})
