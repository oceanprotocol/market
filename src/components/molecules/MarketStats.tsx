import React, { ReactElement, useEffect, useState } from 'react'
import styles from './MarketStats.module.css'
import { gql, useQuery } from 'urql'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'
import Tooltip from '../atoms/Tooltip'
import { useUserPreferences } from '../../providers/UserPreferences'
import NetworkName from '../atoms/NetworkName'

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
  const [totalValueLocked, setTotalValueLocked] = useState<string>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] = useState<string>()
  const [poolCount, setPoolCount] = useState<number>()
  const { chainIds } = useUserPreferences()
  const [result] = useQuery({
    query: getTotalPoolsValues
    // pollInterval: 20000
  })
  const { data } = result

  useEffect(() => {
    if (!data || !data.poolFactories || data.poolFactories.length === 0) return
    setTotalValueLocked(data.poolFactories[0].totalValueLocked)
    setTotalOceanLiquidity(data.poolFactories[0].totalOceanLiquidity)
    setPoolCount(data.poolFactories[0].finalizedPoolCount)
  }, [data])

  return (
    <>
      {chainIds.map((chainId, key) => (
        <div key={key}>
          <NetworkName networkId={chainId} />
          <div className={styles.stats}>
            <Conversion price={`${totalValueLocked}`} hideApproximateSymbol />{' '}
            <abbr title="Total Value Locked">TVL</abbr> across{' '}
            <strong>{poolCount}</strong> data set pools that contain{' '}
            <PriceUnit
              price={totalOceanLiquidity}
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
        </div>
      ))}
    </>
  )
}
