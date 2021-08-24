import { DDO, Logger } from '@oceanprotocol/lib'
import React, { useEffect, useState } from 'react'
import { ReactElement } from 'react-markdown'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useWeb3 } from '../../../providers/Web3'
import {
  getAccountLiquidityInOwnAssets,
  getAccountNumberOfOrders,
  getAssetsBestPrices,
  UserTVL
} from '../../../utils/subgraph'
import Conversion from '../../atoms/Price/Conversion'
import NumberUnit from '../../molecules/NumberUnit'
import { ReactComponent as Published } from '../../../images/published.svg'
import { ReactComponent as Sold } from '../../../images/sold.svg'
import { ReactComponent as Tvl } from '../../../images/tvl.svg'
import styles from './Stats.module.css'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../../utils/aquarius'
import axios from 'axios'

export default function Stats(): ReactElement {
  const { accountId } = useWeb3()
  const { chainIds } = useUserPreferences()

  const [publishedAssets, setPublishedAssets] = useState<DDO[]>()
  const [numberOfAssets, setNumberOfAssets] = useState<number>()
  const [sold, setSold] = useState<number>()
  const [tvl, setTvl] = useState<UserTVL>()

  useEffect(() => {
    if (!accountId) return

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
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getPublished()

    async function getAccountSoldValue() {
      const nrOrders = await getAccountNumberOfOrders(accountId, chainIds)
      setSold(nrOrders)
    }
    getAccountSoldValue()
  }, [accountId, chainIds])

  useEffect(() => {
    async function getAccountTVL() {
      if (!publishedAssets) return

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
        label="Published"
        value={numberOfAssets}
        icon={<Published />}
      />
      <NumberUnit label="Sold" value={sold} icon={<Sold />} />
      <NumberUnit
        label="Total Value Locked"
        value={<Conversion price={tvl?.price} hideApproximateSymbol />}
        icon={<Tvl />}
      />
    </div>
  )
}
