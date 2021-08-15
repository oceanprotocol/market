import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AccountHeader.module.css'
import get3BoxProfile from '../../../utils/profile'
import { ProfileLink } from '../../../models/Profile'
import { accountTruncate } from '../../../utils/web3'
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
  getAccountLiquidityInOwnAssets,
  UserTVL
} from '../../../utils/subgraph'
import Conversion from '../../atoms/Price/Conversion'
import { ReactComponent as Avatar } from '../../../images/logo.svg'
import { ReactComponent as Published } from '../../../images/published.svg'
import { ReactComponent as Sold } from '../../../images/sold.svg'
import { ReactComponent as Tvl } from '../../../images/tvl.svg'
import Token from '../../organisms/AssetActions/Pool/Token'
import { getOceanConfig } from '../../../utils/ocean'

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
  const [tvl, setTvl] = useState<UserTVL>()
  const [isReadMore, setIsReadMore] = useState(true)
  const [isShowMore, setIsShowMore] = useState(false)

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  useEffect(() => {
    if (!accountId) return

    const source = axios.CancelToken.source()

    async function getInfoFrom3Box() {
      const profile = await get3BoxProfile(accountId, source.token)
      if (profile) {
        const { name, emoji, description, image, links } = profile
        setName(`${emoji || ''} ${name || accountTruncate(accountId)}`)
        setDescription(description || null)
        setImage(image || null)
        setLinks(links || [])
      } else {
        setName(accountTruncate(accountId))
        setDescription(null)
        setImage(null)
        setLinks([])
      }
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
    <div>
      {accountId ? (
        <div className={styles.gridContainer}>
          <div className={styles.infoSection}>
            <div className={styles.profileInfoGrid}>
              {image ? (
                <img
                  src={image}
                  className={styles.image}
                  width="48"
                  height="48"
                />
              ) : (
                <Avatar className={styles.image} />
              )}
              <div>
                <h3 className={styles.name}>
                  {name || accountTruncate(accountId)}
                </h3>
                {chainIds.map((value, index) => {
                  const oceanConfig = getOceanConfig(value)
                  if (!isShowMore && index > 0) return
                  return (
                    <ExplorerLink
                      className={styles.truncate}
                      networkId={value}
                      path={`address/${accountId}`}
                    >
                      <code>
                        {accountTruncate(accountId)} on{' '}
                        {oceanConfig?.explorerUri}
                      </code>
                    </ExplorerLink>
                  )
                })}
                <span className={styles.more} onClick={toogleShowMore}>
                  {!isShowMore
                    ? `Show ${chainIds.length - 1} more`
                    : 'Show less'}
                </span>
              </div>
            </div>
            <div className={styles.statisticsOverviewGrid}>
              <Published className={styles.statisticsImages} />
              <p className={styles.statisticsValues}>{numberOfAssets}</p>
              <Sold className={styles.statisticsImages} />
              <p className={styles.statisticsValues}>{sold}</p>
              <Tvl className={styles.statisticsImages} />
              <div className={styles.liquidity}>
                <Conversion
                  price={tvl?.price}
                  className={styles.statisticsValues}
                  hideApproximateSymbol
                />
                <Token symbol="OCEAN" balance={tvl?.oceanBalance} noIcon />
              </div>
              <p className={styles.statiscsLabel}>Published</p>
              <p className={styles.statiscsLabel}>Sold</p>
              <p className={styles.statiscsLabel}>TVL</p>
            </div>
          </div>
          <div>
            <p className={styles.descriptionLabel}>About</p>
            <div>
              <p
                className={`${styles.description} ${
                  isReadMore ? `${styles.shortDescription}` : ''
                }`}
              >
                {description || 'No description found.'}
              </p>
              <span className={styles.more} onClick={toggleReadMore}>
                {isReadMore ? 'Read more' : 'Show less'}
              </span>
            </div>
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
