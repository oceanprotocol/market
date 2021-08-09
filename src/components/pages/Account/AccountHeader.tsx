import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AccountHeader.module.css'
import get3BoxProfile from '../../../utils/profile'
import { Profile, ProfileLink } from '../../../models/Profile'
import axios from 'axios'
import ExplorerLink from '../../atoms/ExplorerLink'
import PublisherLinks from '../../atoms/Publisher/PublisherLinks'
import { useUserPreferences } from '../../../providers/UserPreferences'
import {
  transformChainIdsListToQuery,
  queryMetadata
} from '../../../utils/aquarius'
import { Logger, DDO } from '@oceanprotocol/lib'
import {
  getAccountNumberOfOrders,
  getAssetsBestPrices,
  getAccountLiquidityInOwnAssets
} from '../../../utils/subgraph'
import Conversion from '../../atoms/Price/Conversion'
import { ReactComponent as Published } from '../../../images/published.svg'
import { ReactComponent as Sold } from '../../../images/sold.svg'
import { ReactComponent as Tvl } from '../../../images/tvl.svg'

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [image, setImage] = useState<string>()
  const [links, setLinks] = useState<ProfileLink[]>()
  const [publishedAssets, setPublishedAssets] = useState<DDO[]>()
  const [numberOfAssets, setNumberOfAssets] = useState<number>()
  const [sold, setSold] = useState<number>()
  const [tvl, setTvl] = useState<string>()

  useEffect(() => {
    if (!accountId) return

    const source = axios.CancelToken.source()

    async function getInfoFrom3Box() {
      const profile = await get3BoxProfile(accountId, source.token)
      if (!profile) return

      const { name, emoji, did, description, image, links } = profile
      name && setName(`${emoji || ''} ${name}`)
      description && setDescription(description)
      image && setImage(image)
      image && setLinks(links)
    }
    getInfoFrom3Box()

    return () => {
      source.cancel()
    }
  }, [accountId])

  useEffect(() => {
    async function getPublished() {
      if (!accountId) return
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
      if (!accountId) return
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
        const userTvl = await getAccountLiquidityInOwnAssets(
          accountId,
          chainIds,
          accountPoolAdresses
        )
        setTvl(userTvl.toString())
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getAccountTVL()
  }, [publishedAssets])

  return (
    <div>
      {accountId ? (
        <div className={styles.gridContainer}>
          <div>
            <div className={styles.profileInfoGrid}>
              <img
                src={image}
                className={styles.image}
                width="48"
                height="48"
              />
              <div>
                <h3 className={styles.name}>{name}</h3>
                <ExplorerLink networkId={1} path={`address/${accountId}`}>
                  <code>{accountId}</code>
                </ExplorerLink>
              </div>
            </div>
            <div className={styles.statisticsOverviewGrid}>
              <div>
                <div className={styles.statisticsGrid}>
                  <Published className={styles.statisticsImages} />
                  <p className={styles.statisticsValues}>{numberOfAssets}</p>
                </div>
                <p className={styles.statiscsLabel}>Published</p>
              </div>
              <div>
                <div className={styles.statisticsGrid}>
                  <Sold className={styles.statisticsImages} />
                  <p className={styles.statisticsValues}>{sold}</p>
                </div>
                <p className={styles.statiscsLabel}>Sold</p>
              </div>
              <div>
                <div className={styles.statisticsGrid}>
                  <Tvl className={styles.statisticsImages} />
                  <Conversion
                    price={tvl}
                    className={styles.statisticsValues}
                    hideApproximateSymbol
                  />
                </div>
                <p className={styles.statiscsLabel}>TVL</p>
              </div>
            </div>
          </div>
          <div>
            <p className={styles.descriptionLabel}>About</p>
            <p className={styles.description}>{description}</p>
            <PublisherLinks links={links} />
          </div>
        </div>
      ) : (
        <p>
          Please connect your Web3 wallet or add a valid publisher identifier in
          the url.
        </p>
      )}
    </div>
  )
}
