import { getEnsName, getEnsAddress, getEnsProfile } from '.'

// TODO: this directly hits the ENS registry, which is not ideal
// so we need to rewrite this to mock responses instead for more reliable test runs.
describe('@utils/ens', () => {
  jest.setTimeout(10000)
  jest.retryTimes(2)

  test('getEnsName', async () => {
    const ensName = await getEnsName(
      '0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0'
    )
    expect(ensName).toBe('jellymcjellyfish.eth')
  })

  test('getEnsName with invalid address', async () => {
    const ensName = await getEnsName('0x123')
    expect(ensName).toBeUndefined()
  })

  test('getEnsName with empty address', async () => {
    const ensName = await getEnsName('')
    expect(ensName).toBeUndefined()
  })

  test('getEnsName with undefined address', async () => {
    const ensName = await getEnsName(undefined)
    expect(ensName).toBeUndefined()
  })

  test('getEnsAddress', async () => {
    const ensAddress = await getEnsAddress('jellymcjellyfish.eth')
    expect(ensAddress).toBe('0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0')
  })

  test('getEnsAddress with invalid address', async () => {
    const ensAddress = await getEnsAddress('0x123')
    expect(ensAddress).toBeUndefined()
  })

  test('getEnsAddress with empty address', async () => {
    const ensAddress = await getEnsAddress('')
    expect(ensAddress).toBeUndefined()
  })

  test('getEnsProfile', async () => {
    const ensProfile = await getEnsProfile(
      '0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0'
    )
    expect(ensProfile).toEqual({
      avatar:
        'https://metadata.ens.domains/mainnet/avatar/jellymcjellyfish.eth',
      links: [
        { key: 'url', value: 'https://oceanprotocol.com' },
        { key: 'com.twitter', value: 'oceanprotocol' },
        { key: 'com.github', value: 'oceanprotocol' }
      ],
      name: 'jellymcjellyfish.eth'
    })
  })

  test('getEnsProfile with empty address', async () => {
    const ensProfile = await getEnsProfile('')
    expect(ensProfile).toBeUndefined()
  })
})
