import { sanitizeUrl, isGoogleUrl } from '.'

describe('@utils/url', () => {
  test('sanitizeUrl', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
    expect(sanitizeUrl('ftp://example.com')).toBe('about:blank')
  })
})

describe('isGoogleUrl', () => {
  it('should return true if the url is a google domain', () => {
    expect(isGoogleUrl('https://google.com')).toBe(true)
  })
  it('should return true if the url is a google domain', () => {
    expect(isGoogleUrl('https://drive.google.com')).toBe(true)
  })
  it('should return false if the url is not a google domain', () => {
    expect(isGoogleUrl('https://drive.gloogle.com')).toBe(false)
  })
  it('should return false if the url is not a google domain', () => {
    expect(isGoogleUrl('https://drive.google.test.com')).toBe(false)
  })
  it('should return false if the url is not a google domain', () => {
    expect(isGoogleUrl('https://google.com.test.com')).toBe(false)
  })
})
