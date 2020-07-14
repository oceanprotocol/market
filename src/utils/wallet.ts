import { OceanProviderValue } from '@oceanprotocol/react'
import { networks } from '../../app.config'

export async function connectWallet(
  connect: OceanProviderValue['connect']
): Promise<void> {
  const { default: WalletConnectProvider } = await import(
    '@walletconnect/web3-provider'
  )
  const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: 'INFURA_ID' // required
      }
    }
  }

  await connect({ cacheProvider: true, providerOptions })
}

export function isCorrectNetwork(chainId: number): boolean {
  const allowedIds = networks
  return allowedIds.includes(chainId)
}

export function accountTruncate(account: string): string {
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}
