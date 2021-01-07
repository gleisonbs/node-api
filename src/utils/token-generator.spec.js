class TokenGenerator {
  async generate (data) {
    return null
  }
}

describe('Token Generator ', () => {
  it('Should return null if JWT returns null', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('test_id')
    expect(token).toBe(null)
  })
})
