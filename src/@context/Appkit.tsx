'use client'

import { createAppKit } from '@reown/appkit/react'
import { AppKitNetwork, localhost } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { getSupportedChains } from '@utils/wallet/chains'
import { chainIdsSupported } from 'app.config.cjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import React, { ReactNode } from 'react'

const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID
const queryClient = new QueryClient()

const metadata = {
  name: 'Ocean Annotation Market',
  description: 'Ocean Annotation Market',
  url: 'http://localhost:8000',
  icons: [
    'https://oceanprotocol.com/static/ae84296f3b9ccb7054530d3af623f1fa/logo.svg'
  ]
}

const chains = [...getSupportedChains(chainIdsSupported)]
if (process.env.NEXT_PUBLIC_MARKET_DEVELOPMENT === 'true') {
  chains.push({ ...localhost, id: 8996 })
}

const networks = chains as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

export const appkit = createAppKit({
  adapters: [wagmiAdapter, new EthersAdapter()],
  metadata,
  networks,
  projectId,
  features: {
    analytics: false,
    connectMethodsOrder: ['wallet', 'email', 'social'],
    connectorTypeOrder: ['injected'],
    socials: ['google']
  },

  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  ],
  allWallets: 'HIDE',
  enableWalletGuide: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-border-radius-master': '2px'
  },
  defaultAccountTypes: { eip155: 'eoa' }
})

export function AppKit({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
