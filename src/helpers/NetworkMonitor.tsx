import React, { useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { getOceanConfig } from './wrapRootElement'

export function NetworkMonitor() {
  const { connect, web3Provider } = useOcean()

  const handleNetworkChanged = (chainId: number) => {
    const config = getOceanConfig(chainId)
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
