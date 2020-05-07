import React, { useState, useEffect } from 'react'
import Web3Connect from 'web3connect'
import Web3 from 'web3'
import { context, InjectedProviderStatus } from './Web3Context'
import getFromFaucet from '../utils/getFromFaucet'

export default function Web3Provider({ children }: { children: any }) {
  const [web3, setWeb3] = useState<null | Web3>(null)
  const [ethProvider, setEthProvider] = useState<any>(null)
  const [ethProviderStatus, setEthProviderStatus] = useState(
    InjectedProviderStatus.NOT_AVAILABLE
  )
  const [web3Connect, setWeb3Connect] = useState<any>(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')

  function init(networkId?: string | number) {
    const instance = new Web3Connect.Core({
      network: `${networkId}`,
      providerOptions: {}
    })
    setWeb3Connect(instance)

    if (Web3Connect.checkInjectedProviders().injectedAvailable) {
      setEthProviderStatus(InjectedProviderStatus.NOT_CONNECTED)
    }
  }

  // On mount setup Web3Connect instance & check for injected provider
  useEffect(() => {
    init()
  }, [])

  async function getAccount(web3: Web3) {
    const accounts = await web3.eth.getAccounts()
    return accounts[0]
  }

  async function getBalance(web3: Web3, address: string) {
    const balance = await web3.eth.getBalance(address)
    return Web3.utils.fromWei(balance)
  }

  //
  // Listen for provider, account & network changes
  // and react to it
  //
  const handleConnect = async (provider: any) => {
    console.debug("Handling 'connect' event with payload", provider)
    setEthProvider(provider)
    setEthProviderStatus(InjectedProviderStatus.CONNECTED)

    const web3 = new Web3(provider)
    setWeb3(web3)

    const account = await getAccount(web3)
    setAccount(account)

    const balance = await getBalance(web3, account)
    setBalance(balance)
  }

  const handleAccountsChanged = async (accounts: string[]) => {
    console.debug("Handling 'accountsChanged' event with payload", accounts)
    if (accounts.length > 0) {
      setAccount(accounts[0])

      if (web3) {
        const balance = await getBalance(web3, accounts[0])
        setBalance(balance)
      }
    }
  }

  const handleNetworkChanged = async (networkId: string | number) => {
    console.debug("Handling 'networkChanged' event with payload", networkId)
    ethProvider.autoRefreshOnNetworkChange = false
    init(networkId)
    handleConnect(ethProvider)
  }

  //
  // Setup event listeners.
  // Web3Connect only supports a 'connect', 'error', and 'close' event,
  // so we use the injected provider events to handle the rest.
  //
  useEffect(() => {
    web3Connect && web3Connect.on('connect', handleConnect)

    if (ethProvider) {
      ethProvider.on('accountsChanged', handleAccountsChanged)
      ethProvider.on('networkChanged', handleNetworkChanged)

      return () => {
        ethProvider.removeListener('accountsChanged', handleAccountsChanged)
        ethProvider.removeListener('networkChanged', handleNetworkChanged)
      }
    }
  }, [web3, web3Connect, ethProvider])

  //
  // Automatically request ETH from Faucet
  //
  useEffect(() => {
    async function getEth(): Promise<null> {
      if (!account || !balance) return null

      const hasEnough = Number(balance) > 0
      if (hasEnough) return null

      await getFromFaucet(account)
      return null
    }
    getEth()
  }, [account, balance])

  const contextValue = {
    web3,
    web3Connect,
    ethProviderStatus,
    account,
    balance
  }

  return <context.Provider value={contextValue}>{children}</context.Provider>
}
