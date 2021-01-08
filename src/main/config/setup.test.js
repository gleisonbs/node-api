const app = require('./app')
const request = require('supertest')

describe('App Setup', () => {
  it('Should disable X-Powered-By header', async () => {
    app.get('/', (req, res) => { res.send('') })
    const response = await request(app).get('/')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  it('Should enable CORS', async () => {
    app.get('/', (req, res) => { res.send('') })

    const response = await request(app).get('/')
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
  })
})
