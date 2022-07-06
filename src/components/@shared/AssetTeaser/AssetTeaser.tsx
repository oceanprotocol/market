import { LoggerInstance } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './AssetTeaser.module.css'
import { getServiceByName } from '@utils/ddo'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getPoolData } from '@context/Pool/_utils'
import { PoolData_poolData as PoolDataPoolData } from 'src/@types/subgraph/PoolData'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
}

const refreshInterval = 10000 // 10 sec.

export default function AssetTeaser({
  asset,
  noPublisher
}: AssetTeaserProps): ReactElement {
  const { name, type, description } = asset.metadata
  const { datatokens } = asset
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { orders } = asset.stats
  const [poolData, setPoolData] = useState<PoolDataPoolData>()

  const fetchPoolData = useCallback(async () => {
    if (!asset.chainId || !asset?.accessDetails?.addressOrId || !owner) return

    const response = await getPoolData(
      asset.chainId,
      asset.accessDetails.addressOrId,
      owner,
      ''
    )

    if (!response) return

    setPoolData(response.poolData)

    LoggerInstance.log('[pool] Fetched pool data:', response.poolData)
  }, [asset.chainId, asset?.accessDetails?.addressOrId, owner])

  useEffect(() => {
    fetchPoolData()
    const interval = setInterval(() => {
      fetchPoolData()
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchPoolData, asset])

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${asset.id}`}>
        <a className={styles.link}>
          <header className={styles.header}>
            <div className={styles.symbol}>{datatokens[0]?.symbol}</div>
            <Dotdotdot clamp={3}>
              <h1 className={styles.title}>{name}</h1>
            </Dotdotdot>
            {!noPublisher && (
              <Publisher account={owner} minimal className={styles.publisher} />
            )}
          </header>

          <AssetType
            type={type}
            accessType={accessType}
            className={styles.typeDetails}
            totalSales={orders}
            poolData={poolData}
          />

          <div className={styles.content}>
            <Dotdotdot tagName="p" clamp={3}>
              {removeMarkdown(description?.substring(0, 300) || '')}
            </Dotdotdot>
          </div>

          <footer className={styles.foot}>
            <Price accessDetails={asset.accessDetails} size="small" />
            <NetworkName networkId={asset.chainId} className={styles.network} />
          </footer>
        </a>
      </Link>
    </article>
  )
}
