import { gql, OperationContext, OperationResult } from 'urql'
import { fetchData } from './subgraph'

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

export async function getEnsName(accountId: string): Promise<string> {
  const response: OperationResult<any> = await fetchData(
    UserEnsNames,
    { accountId: accountId.toLowerCase() },
    ensSubgraphQueryContext
  )
  if (!response?.data?.domains?.length) return

  // Default order of response.data.domains seems to be by creation time, from oldest to newest.
  // Pick the last one as that is what direct web3 calls do.
  const { name } = response.data.domains.slice(-1)[0]
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
