import { sanitizeUrl } from './url'

describe('@utils/url', () => {
  test('sanitizeUrl', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
    expect(sanitizeUrl('ftp://example.com')).toBe('about:blank')
  })
})
