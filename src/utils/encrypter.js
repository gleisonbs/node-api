const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hashedValue) {
    const isValid = bcrypt.compare(value, hashedValue)
    return isValid
  }
}

module.exports = Encrypter
