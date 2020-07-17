import { OceanProviderValue } from '@oceanprotocol/react'
import { networks, infuraProjectId } from '../../app.config'

const web3ModalTheme = {
  background: 'var(--brand-white)',
  main: 'var(--brand-black)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--brand-grey-lighter)',
  hover: 'var(--brand-grey-dimmed)'
}

export async function connectWallet(
  connect: OceanProviderValue['connect']
): Promise<void> {
  const { default: WalletConnectProvider } = await import(
    '@walletconnect/web3-provider'
  )

  // Provider Options
  // https://github.com/Web3Modal/web3modal#provider-options
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: infuraProjectId
      }
    }
  }

  await connect({ cacheProvider: true, providerOptions, theme: web3ModalTheme })
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

export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'Main'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    default:
      return 'Unknown'
  }
}
