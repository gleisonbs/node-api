module.exports = {
  token: 'token',
  sign (payload, secretOrPrivateKey) {
    return this.token
  }
}
