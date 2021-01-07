const jwt = require('jsonwebtoken')
const MissingParamError = require('./errors/missing-param-error')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (payload) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }

    if (!payload) {
      throw new MissingParamError('payload')
    }
    return jwt.sign(payload, this.secret)
  }
}

module.exports = TokenGenerator
