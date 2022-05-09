import ENS, { getEnsAddress as getEnsAddressVendor } from '@ensdomains/ensjs'
import { getDummyWeb3 } from './web3'

let ens: any

async function getWeb3Provider(): Promise<any> {
  const provider = (await getDummyWeb3(1)).currentProvider
  return provider
}

async function getEns(): Promise<any> {
  const _ens =
    ens ||
    new ENS({
      provider: await getWeb3Provider(),
      ensAddress: getEnsAddressVendor(1)
    })
  ens = _ens

  return _ens
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
  const ens = await getEns()
  const name = await getEnsName(accountId)

  if (!name) return { name: null }

  // TODO: fetch all set keys first, then fetch values
  // as this does unneccessary calls otherwise.
  // https://docs.ens.domains/dapp-developer-guide/resolving-names#listing-cryptocurrency-addresses-and-text-records
  const avatar = await ens.name(name).getText('avatar')
  const url = await ens.name(name).getText('url')
  const description = await ens.name(name).getText('description')
  const twitter = await ens.name(name).getText('com.twitter')
  const github = await ens.name(name).getText('com.github')
  const telegram = await ens.name(name).getText('org.telegram')
  const discord = await ens.name(name).getText('com.discord')
  const reddit = await ens.name(name).getText('com.reddit')

  const links: ProfileLink[] = [
    ...(twitter && [{ name: 'Twitter', value: twitter }]),
    ...(github && [{ name: 'GitHub', value: github }]),
    ...(telegram && [{ name: 'Telegram', value: telegram }]),
    ...(discord && [{ name: 'Discord', value: discord }]),
    ...(reddit && [{ name: 'Reddit', value: reddit }])
  ]

  const profile: Profile = {
    name,
    url,
    avatar: avatar && `https://metadata.ens.domains/mainnet/avatar/${name}`,
    description,
    links
  }

  return profile
}
