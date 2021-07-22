import React, { ReactElement, useEffect, useState } from 'react'
import { gql, OperationContext } from 'urql'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'
import Tooltip from '../atoms/Tooltip'
import NetworkName from '../atoms/NetworkName'
import { fetchData, getSubgrahUri } from '../../utils/subgraph'
import { filterNetworksByType } from './UserPreferences/Networks/index'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import useNetworkMetadata from '../../hooks/useNetworkMetadata'
import { Logger } from '@oceanprotocol/lib'
import styles from './MarketStats.module.css'

const getTotalPoolsValues = gql`
  query PoolsData {
    poolFactories {
      totalValueLocked
      totalOceanLiquidity
      finalizedPoolCount
    }
  }
`

function MarketNetworkStats({
  totalValueLocked,
  poolCount,
  totalOceanLiquidity
}: {
  totalValueLocked: string
  poolCount: string
  totalOceanLiquidity: string
}): ReactElement {
  return (
    <>
      <Conversion price={totalValueLocked} hideApproximateSymbol />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{poolCount}</strong> data set pools that contain{' '}
      <PriceUnit price={totalOceanLiquidity} small className={styles.total} />,
      plus datatokens for each pool.
    </>
  )
}

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

        const { totalValueLocked, totalOceanLiquidity, finalizedPoolCount } =
          response?.data?.poolFactories[0]

        await setTotalValueLocked((prevState) => ({
          ...prevState,
          [chainId]: totalValueLocked
        }))
        await setTotalOceanLiquidity((prevState) => ({
          ...prevState,
          [chainId]: totalOceanLiquidity
        }))
        await setPoolCount((prevState) => ({
          ...prevState,
          [chainId]: finalizedPoolCount
        }))

        newTotalValueLockedSum += parseInt(totalValueLocked)
        newTotalOceanLiquiditySum += parseInt(totalOceanLiquidity)
        newPoolCountSum += parseInt(finalizedPoolCount)
      } catch (error) {
        Logger.error('Error fetchData: ', error.message)
      }
    }
    setTotalValueLockedSum(`${newTotalValueLockedSum}`)
    setTotalOceanLiquiditySum(`${newTotalOceanLiquiditySum}`)
    setPoolCountSum(`${newPoolCountSum}`)
  }

  useEffect(() => {
    getMarketStats()
  }, [])

  const tooltipContent = (
    <>
      <ul className={styles.statsList}>
        {totalValueLocked &&
          totalOceanLiquidity &&
          poolCount &&
          mainChainIds?.map((chainId, key) => (
            <li key={key}>
              <NetworkName networkId={chainId} />
              <div className={styles.tooltipStats}>
                <MarketNetworkStats
                  totalValueLocked={totalValueLocked[chainId] || '0'}
                  totalOceanLiquidity={totalOceanLiquidity[chainId] || '0'}
                  poolCount={poolCount[chainId] || '0'}
                />
              </div>
            </li>
          ))}
      </ul>
      Counted on-chain from our pool factory. Does not filter our data sets in{' '}
      <a href="https://github.com/oceanprotocol/list-purgatory">
        list-purgatory
      </a>
    </>
  )

  return (
    <div className={styles.stats}>
      <>
        <MarketNetworkStats
          totalValueLocked={totalValueLockedSum || '0'}
          totalOceanLiquidity={totalOceanLiquiditySum || '0'}
          poolCount={poolCountSum || '0'}
        />
        <Tooltip className={styles.info} content={tooltipContent} />
      </>
    </div>
  )
}
