const MissingParamError = require('../../utils/errors/missing-param-error')
const InvalidParamError = require('../../utils/errors/invalid-param-error')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!this.userModel) {
      throw new MissingParamError('userModel')
    }

    if (!this.userModel.findOne) {
      throw new InvalidParamError('userModel')
    }

    if (!email) {
      throw new MissingParamError('email')
    }

    const user = await this.userModel.findOne(
      { email },
      { projection: { password: 1 } }
    )
    return user
  }
}

module.exports = LoadUserByEmailRepository
