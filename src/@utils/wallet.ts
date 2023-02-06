import { LoggerInstance } from '@oceanprotocol/lib'
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from '@web3modal/ethereum'
import { configureChains, createClient, erc20ABI } from 'wagmi'
import { mainnet, polygon, bsc, goerli, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

// Wagmi client
export const { chains, provider } = configureChains(
  [mainnet, polygon, bsc, goerli, polygonMumbai],
  [
    walletConnectProvider({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID }),
    publicProvider()
  ]
)

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: 'Ocean Market',
    version: '2',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains
  }),
  provider
})

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains)

export function accountTruncate(account: string): string {
  if (!account || account === '') return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

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
          }) to MetaMask, error: ${err.message || added.error}`
        )
      } else {
        LoggerInstance.log(
          `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
        )
      }
    }
  )
}

export async function getTokenBalance(
  accountId: string,
  decimals: number,
  tokenAddress: string,
  web3Provider: ethers.providers.Provider
): Promise<string> {
  if (!web3Provider) return

  try {
    const token = new ethers.Contract(tokenAddress, erc20ABI, web3Provider)
    const balance = await token.balanceOf(accountId)
    const adjustedDecimalsBalance = `${balance}${'0'.repeat(18 - decimals)}`
    return formatEther(adjustedDecimalsBalance)
  } catch (e) {
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
