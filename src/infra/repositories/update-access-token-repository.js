const MissingParamError = require('../../utils/errors/missing-param-error')

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!this.userModel) {
      throw new MissingParamError('userModel')
    }

    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          accessToken
        }
      }
    )
  }
}

module.exports = UpdateAccessTokenRepository
