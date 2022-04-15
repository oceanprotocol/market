export interface OpcValue {
  chainId: number
  swapNotApprovedFee: string
  swapApprovedFee: string
  approvedTokens: string[]
}

export interface GlobalDataProviderValue {
  opcValues: OpcValue[]
  getOpcForToken: (tokenAddress: string, chainId: number) => string
}
