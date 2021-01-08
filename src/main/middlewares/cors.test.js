const app = require('../config/app')
const request = require('supertest')

describe('Middleware CORS', () => {
  it('Should enable CORS', async () => {
    app.get('/test_middleware_cors', (req, res) => { res.send('') })

    const response = await request(app).get('/test_middleware_cors')
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
  })
})
