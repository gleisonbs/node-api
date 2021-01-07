class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

describe('LoadUserByEmail Repositoty', () => {
  it('Should return null if no user is found', async () => {
    const sut = new LoadUserByEmailRepository()
    const user = await sut.load('invalid.email@email.com')
    expect(user).toBeNull()
  })
})
