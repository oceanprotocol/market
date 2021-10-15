import { getCredentialList } from '../../../src/utils/credential'
import { Credential } from '@oceanprotocol/lib'

const addressType = 'address'
const domainType = 'domain'
const address1 = '0x0123456789'
const address2 = '0x1234567890'
const address3 = '0x2345678901'
const address4 = '0x3456789012'
// const domain1 = 'apple.com'
// const domain2 = 'orange.com'
const appleGroup = [address1, address2]
const orangeGroup = [address3, address4]

const allowCredentials: Credential[] = [
  {
    type: addressType,
    values: appleGroup
  }
]

const denyCredentials: Credential[] = [
  {
    type: addressType,
    values: orangeGroup
  }
]

describe('cleanupContentType()', () => {
  it('can get list of addresses in allow credential', async () => {
    const addressList = getCredentialList(allowCredentials, addressType)
    const domainList = getCredentialList(allowCredentials, domainType)
    expect(addressList).toBe(appleGroup)
    expect(domainList).toBe([])
  })
})
