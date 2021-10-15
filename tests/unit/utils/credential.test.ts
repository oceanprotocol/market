import {
  getCredentialList,
  updateCredential
} from '../../../src/utils/credential'
import { Credential } from '@oceanprotocol/lib'

const addressType = 'address'
const domainType = 'domain'
const address1 = '0x0123456789'
const address2 = '0x1234567890'
const domain1 = 'apple.com'
const domain2 = 'orange.com'
const addressList = [address1, address2]
const domainList = [domain1, domain2]

const addressTypeCredential: Credential[] = [
  {
    type: addressType,
    values: addressList
  }
]

const addressTypeAndDomainTYpeCredential: Credential[] = [
  {
    type: addressType,
    values: addressList
  },
  {
    type: domainType,
    values: domainList
  }
]

describe('cleanupContentType()', () => {
  it('can get list of addresses in allow credential', async () => {
    const addressList = getCredentialList(addressTypeCredential, addressType)
    const domainList = getCredentialList(addressTypeCredential, domainType)
    const emptyList = getCredentialList([], domainType)
    expect(addressList).toBe(addressList)
    expect(domainList).toBe([])
    expect(emptyList).toBe([])
  })

  it('can remove address2 from allow credential list', async () => {
    const updatedCredential = updateCredential(
      addressTypeCredential,
      addressType,
      [address1]
    )
    const addressList = getCredentialList(updatedCredential, addressType)
    expect(addressList).toBe([address1])
  })

  it('can remove all address from allow credential list', async () => {
    const updatedCredential = updateCredential(
      addressTypeCredential,
      addressType,
      []
    )
    const addressList = getCredentialList(updatedCredential, addressType)
    expect(addressList).toBe([])
  })

  it('can add address from into empty list', async () => {
    const updatedCredential = updateCredential([], addressType, addressList)
    expect(updatedCredential).toBe(addressTypeCredential)
  })

  it('can remove domain type crdential from existing list', async () => {
    const updatedCredential = updateCredential(
      addressTypeAndDomainTYpeCredential,
      domainType,
      []
    )
    expect(updatedCredential.length).toBe(1)
  })
})
