import { DDO, Logger } from '@oceanprotocol/lib'
import React, { useEffect, useState } from 'react'
import { ReactElement } from 'react-markdown'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import {
  getAccountLiquidityInOwnAssets,
  getAccountNumberOfOrders,
  getAssetsBestPrices,
  UserTVL
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
  const [tvl, setTvl] = useState<UserTVL>()

  useEffect(() => {
    if (!accountId) {
      setNumberOfAssets(0)
      setSold(0)
      setTvl({ price: '0', oceanBalance: '0' })
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

    // async function getAccountSoldValue() {
    //
    // }
    // getAccountSoldValue()
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
        const userTvl: UserTVL = await getAccountLiquidityInOwnAssets(
          accountId,
          chainIds,
          accountPoolAdresses
        )
        setTvl(userTvl)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getAccountTVL()
  }, [publishedAssets])

  return (
    <div className={styles.stats}>
      <NumberUnit
        label="Total Value Locked"
        value={<Conversion price={tvl?.price} hideApproximateSymbol />}
      />
      <NumberUnit label="Sold" value={sold} />
      <NumberUnit label="Published" value={numberOfAssets} />
    </div>
  )
}
