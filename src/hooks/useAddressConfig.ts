import { DDO } from '@oceanprotocol/lib'
import { config } from 'dotenv'
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

  const isAddressWhitelisted = function (address: string) {
    return Object.keys(whitelists).some((field) =>
      whitelists[field].some(
        (whitelistedAddress: string) => whitelistedAddress === address
      )
    )
  }

  const isDDOWhitelisted = function (ddo: DDO) {
    return (
      isAddressWhitelisted(ddo.dataTokenInfo.address) ||
      ddo.publicKey
        .map((pk) => {
          return isAddressWhitelisted(pk.owner)
        })
        .some((isWhitelisted) => isWhitelisted === true)
    )
  }

  return { whitelists, isAddressWhitelisted, isDDOWhitelisted }
}
