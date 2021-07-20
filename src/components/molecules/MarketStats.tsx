import React, { ReactElement, useEffect, useState } from 'react'
import styles from './MarketStats.module.css'
import { gql, OperationContext } from 'urql'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'
import Tooltip from '../atoms/Tooltip'
import NetworkName from '../atoms/NetworkName'
import { fetchData, getSubgrahUri } from '../../utils/subgraph'
import { filterNetworksByType } from './UserPreferences/Networks/index'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import useNetworkMetadata from '../../hooks/useNetworkMetadata'

const getTotalPoolsValues = gql`
  query PoolsData {
    poolFactories {
      totalValueLocked
      totalOceanLiquidity
      finalizedPoolCount
    }
  }
`

export default function MarketStats(): ReactElement {
  const [totalValueLocked, setTotalValueLocked] =
    useState<{ [chainId: number]: string }>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] =
    useState<{ [chainId: number]: string }>()
  const [poolCount, setPoolCount] = useState<{ [chainId: number]: string }>()
  const [totalValueLockedSum, setTotalValueLockedSum] = useState<string>()
  const [totalOceanLiquiditySum, setTotalOceanLiquiditySum] = useState<string>()
  const [poolCountSum, setPoolCountSum] = useState<string>()
  const [mainChainIds, setMainChainIds] = useState<number[]>()
  const [loading, setLoading] = useState(true)
  const { appConfig } = useSiteMetadata()
  const { networksList } = useNetworkMetadata()

  async function getMarketStats() {
    const mainChainIdsList = await filterNetworksByType(
      'mainnet',
      appConfig.chainIdsSupported,
      networksList
    )
    setMainChainIds(mainChainIdsList)
    let newTotalValueLockedSum = 0
    let newTotalOceanLiquiditySum = 0
    let newPoolCountSum = 0
    for (const chainId of mainChainIdsList) {
      const context: OperationContext = {
        url: `${getSubgrahUri(
          chainId
        )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
        requestPolicy: 'network-only'
      }
      try {
        const response = await fetchData(getTotalPoolsValues, null, context)
        if (!response) continue
        await setTotalValueLocked((prevState) => ({
          ...prevState,
          [chainId]: response.data?.poolFactories[0].totalValueLocked
        }))
        await setTotalOceanLiquidity((prevState) => ({
          ...prevState,
          [chainId]: response.data?.poolFactories[0].totalOceanLiquidity
        }))
        await setPoolCount((prevState) => ({
          ...prevState,
          [chainId]: response.data?.poolFactories[0].finalizedPoolCount
        }))
        newTotalValueLockedSum += parseInt(
          response.data?.poolFactories[0].totalValueLocked
        )
        newTotalOceanLiquiditySum += parseInt(
          response.data?.poolFactories[0].totalOceanLiquidity
        )
        newPoolCountSum += parseInt(
          response.data?.poolFactories[0].finalizedPoolCount
        )
      } catch (error) {
        console.error('Error fetchData: ', error.message)
      }
    }
    setTotalValueLockedSum(newTotalValueLockedSum.toString())
    setTotalOceanLiquiditySum(newTotalOceanLiquiditySum.toString())
    setPoolCountSum(newPoolCountSum.toString())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getMarketStats()
  }, [])

  const tooltipContent = !loading && (
    <>
      <ul className={styles.statsList}>
        {mainChainIds.map((chainId, key) => (
          <li key={key}>
            <NetworkName networkId={chainId} />
            <div className={styles.tooltipStats}>
              <Conversion
                price={`${totalValueLocked[chainId]}`}
                hideApproximateSymbol
              />{' '}
              <abbr title="Total Value Locked">TVL</abbr> across{' '}
              <strong>{poolCount[chainId]}</strong> data set pools that contain{' '}
              <PriceUnit
                price={totalOceanLiquidity[chainId]}
                small
                className={styles.total}
              />
              , plus datatokens for each pool.
            </div>
          </li>
        ))}
      </ul>
      {
        'Content on-chain from out pool factory. Does not filter our data sets in '
      }
    </>
  )

  return (
    !loading && (
      <div className={styles.stats}>
        <Conversion price={`${totalValueLockedSum}`} hideApproximateSymbol />{' '}
        <abbr title="Total Value Locked">TVL</abbr> across{' '}
        <strong>{poolCountSum}</strong> data set pools that contain{' '}
        <PriceUnit
          price={totalOceanLiquiditySum}
          small
          className={styles.total}
        />
        , plus datatokens for each pool.
        <Tooltip
          className={styles.info}
          content={tooltipContent}
          reference="list-purgatory"
          link="https://github.com/oceanprotocol/list-purgatory"
        />
      </div>
    )
  )
}
