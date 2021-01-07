module.exports = {
  token: 'token',
  payload: '',
  secretOrPrivateKey: '',
  sign (payload, secretOrPrivateKey) {
    this.secretOrPrivateKey = secretOrPrivateKey
    this.payload = payload
    return this.token
  }
}
