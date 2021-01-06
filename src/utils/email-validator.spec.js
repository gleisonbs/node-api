const validator = require('validator')
const EmailValidator = require('./email-validator')
const MissingParamError = require('./errors/missing-param-error')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  it('Should return true if validator returns true', async () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')

    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator returns false', async () => {
    validator.isEmailValid = false
    const sut = makeSut()

    const isEmailValid = sut.isValid('invalid_email_email.com')
    expect(isEmailValid).toBe(false)
  })

  it('should call validator with correct email', async () => {
    const sut = makeSut()

    const email = 'test_email@email.com'
    sut.isValid(email)

    expect(validator.email).toBe(email)
  })

  it('Should throw if called with incorrect number of parameters', async () => {
    const sut = makeSut()

    expect(() => sut.isValid()).toThrow(new MissingParamError('email'))
  })
})
