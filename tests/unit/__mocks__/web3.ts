export const addresses = ['0x0000000011111111aaaaaaaabbbbbbbb22222222']
export const balances = {
  [addresses[0]]: '1122'
}

export default {
  eth: {
    getChainId: () => Promise.resolve(846353),
    getAccounts: () => {
      return Promise.resolve(addresses)
    },
    getBalance: (address: string) => Promise.resolve(balances[address]),
    personal: {
      sign: () => Promise.resolve('xxxxxxxxxxxx')
    }
  },
  utils: {
    fromWei: () => null as any
  }
} as any
