import cleanupContentType from '../../../src/utils/cleanupContentType'

describe('cleanupContentType()', () => {
  it('outputs known compression', async () => {
    const compression = cleanupContentType('application/zip')
    expect(compression).toBe('zip')
  })

  it('outputs known x- compression', async () => {
    const compression = cleanupContentType('application/x-gtar')
    expect(compression).toBe('gtar')
  })

  it('outputs known x- compression', async () => {
    const compression = cleanupContentType('application/x-lzma')
    expect(compression).toBe('lzma')
  })

  it('pass through unknown compression', async () => {
    const compression = cleanupContentType('blabla')
    expect(compression).toBe('blabla')
  })
})
