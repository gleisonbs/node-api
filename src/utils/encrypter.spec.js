const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hashedValue) {
    const isValid = bcrypt.compare(value, hashedValue)
    return isValid
  }
}

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  it('Should return false if bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('value', 'hashed_value')
    expect(isValid).toBe(false)
  })
})
