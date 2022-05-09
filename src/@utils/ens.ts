import { gql, OperationContext, OperationResult } from 'urql'
import { fetchData } from './subgraph'
import ENS, { getEnsAddress as getEnsAddressVendor } from '@ensdomains/ensjs'
import { getDummyWeb3 } from './web3'

// make sure to only query for domains owned by account, so domains
// solely set by 3rd parties like *.gitcoin.eth won't show up
const UserEnsNames = gql<any>`
  query UserEnsDomains($accountId: String!) {
    domains(where: { resolvedAddress: $accountId, owner: $accountId }) {
      name
    }
  }
`

const UserEnsAddress = gql<any>`
  query UserEnsDomainsAddress($name: String!) {
    domains(where: { name: $name }) {
      resolvedAddress {
        id
      }
    }
  }
`

const ensSubgraphQueryContext: OperationContext = {
  url: `https://api.thegraph.com/subgraphs/name/ensdomains/ens`,
  requestPolicy: 'cache-and-network'
}

export async function getEnsName(
  accountId: string,
  provider?: any,
  networkId = 1
): Promise<string> {
  const web3Provider = provider || (await getDummyWeb3(1)).currentProvider

  const ens = new ENS({
    provider: web3Provider,
    ensAddress: getEnsAddressVendor(networkId)
  })
  let { name } = await ens.getName(accountId)
  // Check to be sure the reverse record is correct.
  const reverseAccountId = await ens.name(name).getAddress()
  if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null

  return name
}

export async function getEnsAddress(ensName: string): Promise<string> {
  const response: OperationResult<any> = await fetchData(
    UserEnsAddress,
    { name: ensName },
    ensSubgraphQueryContext
  )
  if (!response?.data?.domains?.length) return
  const { id } = response.data.domains[0].resolvedAddress
  return id
}
