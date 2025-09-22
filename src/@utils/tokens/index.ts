/**
 * WETH token addresses
 * WETH contract addresses for each supported network
 */
export const WETH_ADDRESSES_BY_NETWORK: Record<string, string> = {
  '1': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '10': '0x4200000000000000000000000000000000000006',
  optimism: '0x4200000000000000000000000000000000000006',
  '137': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  polygon: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  '11155111': '0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323',
  sepolia: '0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323'
}

/**
 * Get WETH address for a specific network
 * @param network -network ID (number) or name (string)
 * @returns WETH contract address for the network, or undefined if not supported
 */
export function getWETHAddress(network: string | number): string | undefined {
  const netKey =
    typeof network === 'number'
      ? String(network)
      : String(network).toLowerCase()
  return WETH_ADDRESSES_BY_NETWORK[netKey]
}

/**
 * Get approved base tokens for a specific network
 * @param chainId - Chain ID
 * @param oceanTokenAddress - Ocean token address (optional, will use WETH if not provided)
 * @param customTokens - Custom tokens configuration from app config (optional)
 * @param autoAddWETH - Whether to automatically add WETH token (default: true)
 * @returns Array of approved base tokens for the network
 */
export function getApprovedBaseTokensForNetwork(
  chainId: number,
  oceanTokenAddress?: string,
  customTokens?: Record<string, TokenInfo[]>,
  autoAddWETH: boolean = true
): TokenInfo[] {
  const tokens: TokenInfo[] = []

  if (autoAddWETH) {
    const wethAddress = getWETHAddress(chainId)

    if (wethAddress) {
      tokens.push({
        address: wethAddress,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18
      })
    } else {
      console.warn(`No WETH address found for chain ID: ${chainId}`)
    }
  }

  if (oceanTokenAddress) {
    const wethAddress = getWETHAddress(chainId)
    if (
      !wethAddress ||
      oceanTokenAddress.toLowerCase() !== wethAddress.toLowerCase()
    ) {
      tokens.push({
        address: oceanTokenAddress,
        name: process.env.NEXT_PUBLIC_OCEAN_TOKEN_SYMBOL || 'OCEAN',
        symbol: process.env.NEXT_PUBLIC_OCEAN_TOKEN_SYMBOL || 'OCEAN',
        decimals: 18
      })
    }
  }

  if (customTokens) {
    const chainIdStr = String(chainId)
    const networkCustomTokens = customTokens[chainIdStr] || []

    networkCustomTokens.forEach((customToken) => {
      const isDuplicate = tokens.some(
        (token) =>
          token.address.toLowerCase() === customToken.address.toLowerCase()
      )
      if (!isDuplicate) {
        tokens.push(customToken)
      }
    })
  }

  return tokens
}

export function isApprovedBaseToken(
  tokenAddress: string,
  chainId: number,
  oceanTokenAddress?: string
): boolean {
  const approvedTokens = getApprovedBaseTokensForNetwork(
    chainId,
    oceanTokenAddress
  )
  return approvedTokens.some(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
  )
}
