const app = require('../config/app')
const request = require('supertest')

describe('Middleware Content-Type', () => {
  it('Should return json content-type as default', async () => {
    app.get('/test_middleware_content_type', (req, res) => {
      res.send()
    })

    const response = await request(app).get('/test_middleware_content_type')
    expect(response.headers['content-type']).toMatch(/json/)
  })

  it('Should return xml content-type if specified', async () => {
    app.get('/test_middleware_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })

    const response = await request(app).get(
      '/test_middleware_content_type_xml'
    )
    expect(response.headers['content-type']).toMatch(/xml/)
  })
})
