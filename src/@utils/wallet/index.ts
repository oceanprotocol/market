import { LoggerInstance } from '@oceanprotocol/lib'
import { createClient, configureChains, erc20ABI } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { sepolia } from 'wagmi/chains'
import { localhost } from '@wagmi/core/chains'
import { ethers, Contract, Signer } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { getNetworkDisplayName } from '@hooks/useNetworkMetadata'
import { getOceanConfig } from '../ocean'
import { getSupportedChains } from './chains'
import { chainIdsSupported } from '../../../app.config.cjs'

// ---------------------------------------------------------
// Dummy signer (solo utilidades internas, NO para producción)
// ---------------------------------------------------------
export async function getDummySigner(chainId: number): Promise<Signer> {
  if (typeof chainId !== 'number') {
    throw new Error('Chain ID must be a number')
  }

  const config = getOceanConfig(chainId)
  try {
    const privateKey =
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const provider = new ethers.providers.JsonRpcProvider(config.nodeUri)
    return new ethers.Wallet(privateKey, provider)
  } catch (error: any) {
    throw new Error(`Failed to create dummy signer: ${error.message}`)
  }
}

// ---------------------------------------------------------
// Wagmi client — forzamos RPC propio y quitamos fallbacks públicos
// ---------------------------------------------------------
const supportedChains = [...getSupportedChains(chainIdsSupported)]
if (process.env.NEXT_PUBLIC_MARKET_DEVELOPMENT === 'true') {
  supportedChains.push({ ...localhost, id: 8996 })
}

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [
    jsonRpcProvider({
      rpc: (chain) => {
        // Sepolia → usa el RPC del .env (evita rpc.sepolia.org y CORS)
        if (chain.id === sepolia.id && process.env.NEXT_PUBLIC_RPC_URI) {
          return { http: process.env.NEXT_PUBLIC_RPC_URI }
        }
        // Localhost 8996
        if (chain.id === 8996) return { http: 'http://127.0.0.1:8545' }

        // Fallback: nodeUri de ocean.js si existe
        const uri = getOceanConfig(chain.id)?.nodeUri
        return uri ? { http: uri } : null
      }
    })
  ]
)

// Conectores SIN WalletConnect (evita WS a wss://2.bridge.walletconnect.org)
const connectors = [
  new MetaMaskConnector({ chains }),
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({ chains, options: { appName: 'Ocean Market' } })
]

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
})

export { chains }

// ---------------------------------------------------------
// ConnectKit CSS theme (puedes dejarlo, no usa WalletConnect)
// ---------------------------------------------------------
export const connectKitTheme = {
  '--ck-font-family': 'var(--font-family-base)',
  '--ck-border-radius': 'var(--border-radius)',
  '--ck-overlay-background': 'var(--background-body-transparent)',
  '--ck-modal-box-shadow': '0 0 20px 20px var(--box-shadow-color)',
  '--ck-body-background': 'var(--background-body)',
  '--ck-body-color': 'var(--font-color-text)',
  '--ck-primary-button-border-radius': 'var(--border-radius)',
  '--ck-primary-button-color': 'var(--font-color-heading)',
  '--ck-primary-button-background': 'var(--background-content)',
  '--ck-secondary-button-border-radius': 'var(--border-radius)'
}

export function accountTruncate(account: string): string {
  if (!account || account === '') return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

// ---------------------------------------------------------
// Wallet utils
// ---------------------------------------------------------
export async function addTokenToWallet(
  address: string,
  symbol: string,
  logo?: string
): Promise<void> {
  const image =
    logo ||
    'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png'

  const tokenMetadata = {
    type: 'ERC20',
    options: { address, symbol, image, decimals: 18 }
  }

  ;(window?.ethereum.request as any)(
    {
      method: 'wallet_watchAsset',
      params: tokenMetadata,
      id: Math.round(Math.random() * 100000)
    },
    (err: { code: number; message: string }, added: any) => {
      if (err || 'error' in added) {
        LoggerInstance.error(
          `Couldn't add ${tokenMetadata.options.symbol} (${
            tokenMetadata.options.address
          }) to MetaMask, error: ${err?.message || added?.error}`
        )
      } else {
        LoggerInstance.log(
          `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
        )
      }
    }
  )
}

export async function addCustomNetwork(
  web3Provider: any,
  network: EthereumListsChain
): Promise<void> {
  const blockExplorerUrls = [
    getOceanConfig(network.networkId).explorerUri,
    network.explorers && network.explorers[0]?.url
  ]

  const newNetworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: getNetworkDisplayName(network),
    nativeCurrency: network.nativeCurrency,
    rpcUrls: network.rpc,
    blockExplorerUrls
  }

  try {
    await web3Provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newNetworkData.chainId }]
    })
  } catch (switchError: any) {
    if (switchError?.code === 4902) {
      await web3Provider.request(
        {
          method: 'wallet_addEthereumChain',
          params: [newNetworkData]
        },
        (err: string, added: any) => {
          if (err || 'error' in added) {
            LoggerInstance.error(
              `Couldn't add ${network.name} (0x${
                network.chainId
              }) network to MetaMask, error: ${err || added?.error}`
            )
          } else {
            LoggerInstance.log(
              `Added ${network.name} (0x${network.chainId}) network to MetaMask`
            )
          }
        }
      )
    } else {
      LoggerInstance.error(
        `Couldn't add ${network.name} (0x${network.chainId}) network to MetaMask, error: ${switchError}`
      )
    }
  }

  LoggerInstance.log(
    `Added ${network.name} (0x${network.chainId}) network to MetaMask`
  )
}

// ---------------------------------------------------------
// Token balance helpers
// ---------------------------------------------------------
export async function getTokenBalance(
  accountId: string,
  decimals: number,
  tokenAddress: string,
  web3Provider: ethers.providers.Provider
): Promise<string | undefined> {
  if (!web3Provider || !accountId || !tokenAddress) return

  try {
    if (!ethers.utils.isAddress(tokenAddress)) {
      LoggerInstance.warn(`Invalid token address: ${tokenAddress}`)
      return
    }

    const code = await web3Provider.getCode(tokenAddress)
    if (code === '0x') {
      LoggerInstance.warn(`No contract found at token address: ${tokenAddress}`)
      return
    }

    const token = new Contract(tokenAddress, erc20ABI, web3Provider)
    const balance = await token.balanceOf(accountId)

    // usa formatUnits para respetar 'decimals'
    return formatUnits(balance, decimals)
  } catch (e: any) {
    LoggerInstance.error(`ERROR: Failed to get the balance: ${e.message}`)
  }
}

export function getTokenBalanceFromSymbol(
  balance: UserBalance,
  symbol: string
): string {
  if (!symbol) return
  const baseTokenBalance = balance?.[symbol.toLocaleLowerCase()]
  return baseTokenBalance || '0'
}
