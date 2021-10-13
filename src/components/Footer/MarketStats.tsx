import React, { ReactElement, useEffect, useState } from 'react'
import { gql, OperationContext } from 'urql'
import Conversion from '@shared/atoms/Price/Conversion'
import PriceUnit from '@shared/atoms/Price/PriceUnit'
import Tooltip from '@shared/atoms/Tooltip'
import NetworkName from '@shared/atoms/NetworkName'
import { fetchData, getSubgraphUri } from '@utils/subgraph'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
import { Logger } from '@oceanprotocol/lib'
import styles from './MarketStats.module.css'
import { filterNetworksByType } from '../Header/UserPreferences/Networks'

const getTotalPoolsValues = gql`
  query PoolsData {
    poolFactories {
      totalValueLocked
      totalOceanLiquidity
      finalizedPoolCount
    }
  }
`

interface Value {
  [chainId: number]: string
}

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
      <strong>{poolCount}</strong> asset pools that contain{' '}
      <PriceUnit price={totalOceanLiquidity} small className={styles.total} />,
      plus datatokens for each pool.
    </>
  )
}

function MarketNetworkStatsTooltip({
  totalValueLocked,
  poolCount,
  totalOceanLiquidity,
  mainChainIds
}: {
  totalValueLocked: Value
  poolCount: Value
  totalOceanLiquidity: Value
  mainChainIds: number[]
}): ReactElement {
  return (
    <>
      <ul className={styles.statsList}>
        {totalValueLocked &&
          totalOceanLiquidity &&
          poolCount &&
          mainChainIds?.map((chainId, key) => (
            <li className={styles.tooltipStats} key={key}>
              <NetworkName networkId={chainId} className={styles.network} />
              <br />
              <Conversion
                price={totalValueLocked[chainId] || '0'}
                hideApproximateSymbol
              />{' '}
              <abbr title="Total Value Locked">TVL</abbr>
              {' | '}
              <strong>{poolCount[chainId] || '0'}</strong> pools
              {' | '}
              <PriceUnit price={totalOceanLiquidity[chainId] || '0'} small />
            </li>
          ))}
      </ul>
      <p className={styles.note}>
        Counted on-chain from our pool factory. Does not filter out assets in{' '}
        <a href="https://github.com/oceanprotocol/list-purgatory">
          list-purgatory
        </a>
      </p>
    </>
  )
}

export default function MarketStats(): ReactElement {
  const [totalValueLocked, setTotalValueLocked] = useState<Value>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] = useState<Value>()
  const [poolCount, setPoolCount] = useState<Value>()
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
        url: `${getSubgraphUri(
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

  return (
    <div className={styles.stats}>
      <>
        <MarketNetworkStats
          totalValueLocked={totalValueLockedSum || '0'}
          totalOceanLiquidity={totalOceanLiquiditySum || '0'}
          poolCount={poolCountSum || '0'}
        />{' '}
        <Tooltip
          className={styles.info}
          content={
            <MarketNetworkStatsTooltip
              totalValueLocked={totalValueLocked}
              poolCount={poolCount}
              totalOceanLiquidity={totalOceanLiquidity}
              mainChainIds={mainChainIds}
            />
          }
        />
      </>
    </div>
  )
}
