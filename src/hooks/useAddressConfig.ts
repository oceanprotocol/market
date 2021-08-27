import { DDO } from '@oceanprotocol/lib'
import addressConfig from '../../address.config'
const { whitelists } = addressConfig

export interface UseAddressConfig {
  whitelists: {
    'publicKey.owner': string[]
    dataToken: string[]
  }
  isAddressWhitelisted: (address: string) => boolean
  isDDOWhitelisted: (ddo: DDO) => boolean
}

function isWhitelistEnabled() {
  return (
    Object.values(whitelists).filter((whitelist) => whitelist.length > 0)
      .length > 0
  )
}

export function useAddressConfig(): UseAddressConfig {
  const isAddressWhitelisted = function (
    address: string,
    field?: keyof UseAddressConfig['whitelists']
  ) {
    if (!isWhitelistEnabled()) return true
    return field
      ? whitelists[field].some(
          (whitelistedAddress) => whitelistedAddress === address
        )
      : Object.values(whitelists).some((whitelist) =>
          whitelist.some((whitelistedAddress) => whitelistedAddress === address)
        )
  }

  const isDDOWhitelisted = function (ddo: DDO) {
    if (!isWhitelistEnabled()) return true
    return (
      ddo &&
      isWhitelistEnabled() &&
      (isAddressWhitelisted(ddo.dataTokenInfo.address, 'dataToken') ||
        ddo.publicKey
          .map((pk) => {
            return isAddressWhitelisted(pk.owner, 'publicKey.owner')
          })
          .some((isWhitelisted) => isWhitelisted === true))
    )
  }

  return { whitelists, isAddressWhitelisted, isDDOWhitelisted }
}
