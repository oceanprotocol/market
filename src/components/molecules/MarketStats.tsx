import React, { ReactElement, useEffect, useState } from 'react'
import styles from './MarketStats.module.css'
import { gql, useQuery } from '@apollo/client'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'

const getTotalPoolsValues = gql`
  query PoolsData {
    poolFactories {
      totalValueLocked
      totalOceanLiquidity
      poolCount
    }
  }
`

export default function MarketStats(): ReactElement {
  const [totalValueLocked, setTotalValueLocked] = useState<string>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] = useState<string>()
  const [poolCount, setPoolCount] = useState<number>()
  const { data } = useQuery(getTotalPoolsValues)

  useEffect(() => {
    if (!data) return

    setTotalValueLocked(data.poolFactories[0].totalValueLocked)
    setTotalOceanLiquidity(data.poolFactories[0].totalOceanLiquidity)
    setPoolCount(data.poolFactories[0].poolCount)
  }, [data])

  return (
    <div className={styles.stats}>
      <Conversion price={`${totalValueLocked}`} hideApproximationSign />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{poolCount}</strong> data set pools that contain{' '}
      <PriceUnit price={totalOceanLiquidity} small className={styles.total} />{' '}
      and datatokens for each pool.
      <br />
    </div>
  )
}
