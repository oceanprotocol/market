import { OceanProviderValue } from '@oceanprotocol/react'

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

  await connect({ providerOptions })
}

export function accountTruncate(account: string): string {
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}
