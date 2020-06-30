import { createMocks } from 'node-mocks-http'
import apiRoute from '../../../api/file'

describe('/api/file', () => {
  test('responds 405 to GET', async () => {
    const { req, res } = createMocks()
    apiRoute(req, res)
    expect(res._getStatusCode()).toBe(405)
  })

  test('responds 200 to POST', async () => {
    const { req, res } = createMocks({ method: 'POST' })
    apiRoute(req, res)
    expect(res._getStatusCode()).toBe(200)
  })

  test('responds correctly to POST and url passed in body', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        url: 'https://oceanprotocol.com/tech-whitepaper.pdf'
      }
    })
    apiRoute(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBeDefined()
  })
})
