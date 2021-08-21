import { DDO } from '@oceanprotocol/lib'
import addressConfig from '../../address.config'

interface UseAddressConfig {
  whitelists: {
    'publicKey.owner': string[]
    dataToken: string[]
  }
  isAddressWhitelisted: (address: string) => boolean
  isDDOWhitelisted: (ddo: DDO) => boolean
}

export function useAddressConfig(): UseAddressConfig {
  const { whitelists } = addressConfig

  const isAddressWhitelisted = function (
    address: string,
    field?: keyof UseAddressConfig['whitelists']
  ) {
    return field
      ? whitelists[field].some(
          (whitelistedAddress) => whitelistedAddress === address
        )
      : Object.values(whitelists).some((whitelist) =>
          whitelist.some((whitelistedAddress) => whitelistedAddress === address)
        )
  }

  const isDDOWhitelisted = function (ddo: DDO) {
    return (
      isAddressWhitelisted(ddo.dataTokenInfo.address, 'dataToken') ||
      ddo.publicKey
        .map((pk) => {
          return isAddressWhitelisted(pk.owner, 'publicKey.owner')
        })
        .some((isWhitelisted) => isWhitelisted === true)
    )
  }

  return { whitelists, isAddressWhitelisted, isDDOWhitelisted }
}
