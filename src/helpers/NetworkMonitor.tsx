import React, { useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { getOceanConfig } from './wrapRootElement'

export function NetworkMonitor() {
  const { connect, web3Provider } = useOcean()

  const handleNetworkChanged = (chainId: number) => {
    // temp hack
    let network = ''
    switch (chainId) {
      case 1: {
        network = 'mainnet'
        break
      }
      case 4: {
        network = 'rinkeby'
        break
      }
    }
    const config = getOceanConfig(network)
    connect(config)
  }
  useEffect(() => {
    if (!web3Provider) return

    web3Provider.on('chainChanged', handleNetworkChanged)

    return () => {
      web3Provider.removeListener('chainChanged', handleNetworkChanged)
    }
  }, [web3Provider])

  return <></>
}
