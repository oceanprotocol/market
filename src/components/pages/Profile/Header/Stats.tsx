import { DDO, Logger } from '@oceanprotocol/lib'
import React, { useEffect, useState } from 'react'
import { ReactElement } from 'react-markdown'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import {
  getAccountLiquidity,
  getAccountLiquidityInOwnAssets,
  getAccountNumberOfOrders,
  getAssetsBestPrices,
  UserLiquidity
} from '../../../../utils/subgraph'
import Conversion from '../../../atoms/Price/Conversion'
import NumberUnit from '../../../molecules/NumberUnit'
import styles from './Stats.module.css'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../../../utils/aquarius'
import axios from 'axios'

export default function Stats({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()

  const [publishedAssets, setPublishedAssets] = useState<DDO[]>()
  const [numberOfAssets, setNumberOfAssets] = useState(0)
  const [sold, setSold] = useState(0)
  const [publisherLiquidity, setPublisherLiquidity] = useState<UserLiquidity>()
  const [totalLiquidity, setTotalLiquidity] = useState(0)

  useEffect(() => {
    if (!accountId) {
      setNumberOfAssets(0)
      setSold(0)
      setPublisherLiquidity({ price: '0', oceanBalance: '0' })
      setTotalLiquidity(0)
      return
    }

    async function getPublished() {
      const queryPublishedAssets = {
        query: {
          query_string: {
            query: `(publicKey.owner:${accountId}) AND (${transformChainIdsListToQuery(
              chainIds
            )})`
          }
        }
      }
      try {
        const source = axios.CancelToken.source()
        const result = await queryMetadata(queryPublishedAssets, source.token)
        setPublishedAssets(result.results)
        setNumberOfAssets(result.totalResults)
        const nrOrders = await getAccountNumberOfOrders(
          result.results,
          chainIds
        )
        setSold(nrOrders)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getPublished()
  }, [accountId, chainIds])

  useEffect(() => {
    if (!publishedAssets) return

    async function getAccountTVL() {
      try {
        const accountPoolAdresses: string[] = []
        const assetsPrices = await getAssetsBestPrices(publishedAssets)
        for (const priceInfo of assetsPrices) {
          if (priceInfo.price.type === 'pool') {
            accountPoolAdresses.push(priceInfo.price.address.toLowerCase())
          }
        }
        const userLiquidity = await getAccountLiquidityInOwnAssets(
          accountId,
          chainIds,
          accountPoolAdresses
        )
        setPublisherLiquidity(userLiquidity)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getAccountTVL()
  }, [publishedAssets, accountId, chainIds])

  useEffect(() => {
    async function initTotalLiquidity() {
      try {
        const totalLiquidity = await getAccountLiquidity(accountId, chainIds)
        setTotalLiquidity(totalLiquidity)
      } catch (error) {
        console.error('Error fetching pool shares: ', error.message)
      }
    }
    initTotalLiquidity()
  }, [accountId, chainIds])

  return (
    <div className={styles.stats}>
      <NumberUnit
        label="Liquidity in Own Assets"
        value={
          <Conversion price={publisherLiquidity?.price} hideApproximateSymbol />
        }
      />
      <NumberUnit
        label="Total Liquidity"
        value={<Conversion price={`${totalLiquidity}`} hideApproximateSymbol />}
      />
      <NumberUnit label="Sales" value={sold} />
      <NumberUnit label="Published" value={numberOfAssets} />
    </div>
  )
}
