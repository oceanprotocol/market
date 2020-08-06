import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import { MetadataMarket } from '../../@types/Metadata'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import { useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import Loader from '../atoms/Loader'

declare type AssetTeaserProps = {
  ddo: DDO
  metadata: MetadataMarket
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  ddo,
  metadata
}: AssetTeaserProps) => {
  if (!metadata.additionalInformation) return null

  const { name } = metadata.main
  const { description } = metadata.additionalInformation
  const isCompute = Boolean(ddo.findServiceByType('compute'))

  const { getBestPrice } = useMetadata(ddo.id)
  const [price, setPrice] = useState<string>()

  useEffect(() => {
    async function init() {
      const price = await getBestPrice(ddo.dataToken)
      setPrice(price)
    }
    init()
  }, [])

  return (
    <article className={styles.teaser}>
      <Link to={`/asset/${ddo.id}`} className={styles.link}>
        <h1 className={styles.title}>{name}</h1>
        {isCompute && <div className={styles.accessLabel}>Compute</div>}

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {description || ''}
          </Dotdotdot>
        </div>

        <footer className={styles.foot}>
          {price ? (
            <Price price={price} small />
          ) : price === '' ? (
            'No price found'
          ) : (
            <Loader message="Retrieving price..." />
          )}
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
