const express = require('express')
const router = express.Router()

module.exports = () => {
  const signUpRoute = new SignUpRouter()
  router.post('/signup', ExpressRouterAdapter.adapt(signUpRoute.route))
}

class ExpressRouterAdapter {
  static adapt (route) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

class SignUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SignUpUseCase().signUp(email, password, repeatPassword)

    return {
      statusCode: 200,
      body: { user }
    }
  }
}

class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      const user = new AddAccountRepository().add(email, password)
      return user
    }
  }
}

const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')
class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
