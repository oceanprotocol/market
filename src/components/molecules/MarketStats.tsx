import React, { ReactElement, useEffect, useState } from 'react'
import styles from './MarketStats.module.css'
import { gql, OperationContext, useQuery } from 'urql'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'
import Tooltip from '../atoms/Tooltip'
import { useUserPreferences } from '../../providers/UserPreferences'
import NetworkName from '../atoms/NetworkName'
import { fetchData, getSubgrahUri } from '../../utils/subgraph'

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
  const { chainIds } = useUserPreferences()
  const [loading, setLoading] = useState(true)

  async function getMarketStatsForChainIds(chainIds: number[]) {
    for (const chainId of chainIds) {
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
      } catch (error) {
        console.error('Error fetchData: ', error.message)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    if (!chainIds) return
    getMarketStatsForChainIds(chainIds)
  }, [chainIds])

  return (
    !loading && (
      <ul>
        {chainIds.map((chainId, key) => (
          <li key={key}>
            <NetworkName networkId={chainId} />
            <div className={styles.stats}>
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
              <Tooltip
                className={styles.info}
                content="Counted on-chain from our pool factory. Does not filter out data sets in "
                reference="list-purgatory"
                link="https://github.com/oceanprotocol/list-purgatory"
              />
            </div>
          </li>
        ))}
      </ul>
    )
  )
}
