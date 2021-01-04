const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

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
})
