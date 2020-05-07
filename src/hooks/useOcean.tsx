import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Ocean } from '@oceanprotocol/squid'
import { config, CHAIN_IDS, OceanConfig } from '../config/ocean'

export enum OceanConnectionStatus {
  OCEAN_CONNECTION_ERROR = -1,
  NOT_CONNECTED = 0,
  CONNECTED = 1
}

export default function useOcean(web3: null | Web3) {
  const [ocean, setOcean] = useState<null | Ocean>(null)
  const [oceanConnectionStatus, setOceanConnectionStatus] = useState(
    OceanConnectionStatus.NOT_CONNECTED
  )
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')

  useEffect(() => {
    async function init() {
      // @FIXME: the effect assumes that this verification will run once when
      // web3 is available, but Metamask might stop reloading the page on
      // network change (the reload behavior can even be disabled):
      // https://github.com/MetaMask/metamask-extension/issues/3599
      // https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider
      if (!web3) return

      const chainId = await web3.eth.getChainId()

      if (CHAIN_IDS.indexOf(chainId) < 0) {
        console.error('Network/chainId not supported.')
        setOceanConnectionStatus(OceanConnectionStatus.NOT_CONNECTED)
        return
      }

      console.debug('Connecting to Ocean...')
      // TODO: quick jest/storybook fix
      // should be removed once we know how to mock Ocean in Jest
      if (!web3.currentProvider) return

      const oceanInstance = await Ocean.getInstance({
        web3Provider: web3.currentProvider,
        ...config
      } as OceanConfig)
      console.debug('Ocean instance ready.')
      setOcean(oceanInstance)
      setOceanConnectionStatus(OceanConnectionStatus.CONNECTED)

      const oceanAccounts = await oceanInstance.accounts.list()
      oceanAccounts && setAccount(oceanAccounts[0].getId())
      const balance = await oceanAccounts[0].getOceanBalance()
      setBalance(`${balance}`)
    }

    try {
      init()
    } catch (error) {
      console.error(error.message)
      setOceanConnectionStatus(OceanConnectionStatus.OCEAN_CONNECTION_ERROR)
      throw error.message
    }
  }, [web3])

  useEffect(() => {
    async function debug() {
      if (!ocean) return
      console.debug(
        `Ocean instance initiated with:\n ${JSON.stringify(config, null, 2)}`
      )
      console.debug(await ocean.versions.get())
    }
    debug()
  }, [ocean])

  return {
    ocean,
    account,
    balance,
    oceanConnectionStatus
  }
}
