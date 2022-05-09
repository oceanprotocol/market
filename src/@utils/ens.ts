import ENS, { getEnsAddress as getEnsAddressVendor } from '@ensdomains/ensjs'
import { gql, OperationResult } from 'urql'
import { fetchData } from './subgraph'
import { getDummyWeb3 } from './web3'

let ens: any

async function getEns(): Promise<any> {
  const _ens =
    ens ||
    new ENS({
      provider: (await getDummyWeb3(1)).currentProvider,
      ensAddress: getEnsAddressVendor(1)
    })
  ens = _ens

  return _ens
}

const ProfileTextRecordsQuery = gql<{
  domains: [{ resolver: { texts: string[] } }]
}>`
  query ProfileTextRecords($name: String!) {
    domains(where: { name: $name }) {
      resolver {
        texts
      }
    }
  }
`

async function getEnsTextRecords(
  ensName: string
): Promise<{ key: string; value: string }[]> {
  // 1. Check which text records are set for the domain with ENS subgraph,
  // to prevent unnecessary contract calls.
  const response: OperationResult<{
    domains: [{ resolver: { texts: string[] } }]
  }> = await fetchData(
    ProfileTextRecordsQuery,
    { name: ensName },
    {
      url: `https://api.thegraph.com/subgraphs/name/ensdomains/ens`,
      requestPolicy: 'cache-and-network'
    }
  )
  if (!response?.data?.domains[0]?.resolver) return

  // 2. Retrieve the text records.
  const { texts } = response.data.domains[0].resolver
  const records = []

  for (let index = 0; index < texts?.length; index++) {
    const key = texts[index]
    const value = await ens.name(ensName).getText(key)
    records.push({ key, value })
  }

  return records
}

export async function getEnsName(accountId: string): Promise<string> {
  const ens = await getEns()
  let { name } = await ens.getName(accountId)

  // Check to be sure the reverse record is correct.
  const reverseAccountId = await ens.name(name).getAddress()
  if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null

  return name
}

export async function getEnsAddress(ensName: string): Promise<string> {
  const ens = await getEns()
  const address = ens.name(ensName).getAddress()

  return address
}

export async function getEnsProfile(accountId: string): Promise<Profile> {
  const name = await getEnsName(accountId)
  if (!name) return { name: null }

  const records = await getEnsTextRecords(name)
  if (!records) return { name }

  const avatar = records.filter((record) => record.key === 'avatar')[0]?.value
  const description = records.filter(
    (record) => record.key === 'description'
  )[0]?.value

  // filter out what we need from the fetched text records
  const linkKeys = [
    'url',
    'com.twitter',
    'com.github',
    'org.telegram',
    'com.discord',
    'com.reddit'
  ]

  const links: ProfileLink[] = records.filter((record) =>
    linkKeys.includes(record.key)
  )

  const profile: Profile = {
    name,
    ...(avatar && {
      avatar: `https://metadata.ens.domains/mainnet/avatar/${name}`
    }),
    ...(description && { description }),
    ...(links.length > 0 && { links })
  }

  return profile
}
