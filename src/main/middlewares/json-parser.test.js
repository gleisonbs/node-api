const app = require('../config/app')
const request = require('supertest')

describe('Middleware JSON Parser', () => {
  it('Should parse body as JSON', async () => {
    app.post('/test_middleware_json_parser', (req, res) => { res.send(req.body) })

    const body = { name: 'gleison' }
    const response = await request(app).post('/test_middleware_json_parser').send(body)
    expect(response.body).toEqual(body)
  })
})
