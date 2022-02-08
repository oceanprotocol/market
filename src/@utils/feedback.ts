export const orderFeedback: { [key in number]: string } = {
  0: 'Buying one datatoken from pool',
  1: 'Approving and ordering asset',
  2: 'Generating signature to access download url'
}

// TODO: customize for compute
export const computeFeedback: { [key in number]: string } = {
  0: 'Ordering asset...',
  1: 'Transfering data token.',
  2: 'Access granted. Starting job...'
}

export function getCreatePricingPoolFeedback(dtSymbol: string): {
  [key: number]: string
} {
  return {
    99: `Minting ${dtSymbol} ...`,
    0: 'Creating pool ...',
    1: `Approving ${dtSymbol} ...`,
    2: 'Approving OCEAN ...',
    3: 'Setup pool ...',
    4: 'Pool created.'
  }
}

export function getCreatePricingExchangeFeedback(dtSymbol: string): {
  [key: number]: string
} {
  return {
    99: `Minting ${dtSymbol} ...`,
    0: 'Creating exchange ...',
    1: `Approving ${dtSymbol} ...`,
    2: 'Fixed exchange created.'
  }
}

export function getCreateFreePricingFeedback(dtSymbol: string): {
  [key: number]: string
} {
  return {
    99: `Creating ${dtSymbol} faucet...`,
    0: 'Setting faucet as minter ...',
    1: 'Approving minter...',
    2: 'Faucet created.'
  }
}

export function getBuyDTFeedback(dtSymbol: string): { [key: number]: string } {
  return {
    1: '1/3 Approving OCEAN ...',
    2: `2/3 Buying ${dtSymbol} ...`,
    3: `3/3 ${dtSymbol} bought.`
  }
}

export function getSellDTFeedback(dtSymbol: string): { [key: number]: string } {
  return {
    1: '1/3 Approving OCEAN ...',
    2: `2/3 Selling ${dtSymbol} ...`,
    3: `3/3 ${dtSymbol} sold.`
  }
}

export function getDispenseFeedback(dtSymbol: string): {
  [key: number]: string
} {
  return {
    1: `1/2 Requesting ${dtSymbol}...`,
    2: `2/2 Received ${dtSymbol}.`
  }
}
