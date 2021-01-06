const bcrypt = require('bcrypt')
const MissingParamError = require('./errors/missing-param-error')

class Encrypter {
  async compare (value, hashedValue) {
    if (!value) {
      throw new MissingParamError('value')
    }

    if (!hashedValue) {
      throw new MissingParamError('hashedValue')
    }

    const isValid = bcrypt.compare(value, hashedValue)
    return isValid
  }
}

module.exports = Encrypter
