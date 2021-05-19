import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import Price from '../atoms/Price'
import { DDO, BestPrice } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import AssetType from '../atoms/AssetType'
import Publisher from '../atoms/Publisher'
import Time from '../atoms/Time'
import {
  teaser,
  link,
  symbol,
  title,
  publisher,
  typeDetails,
  foot,
  content,
  date
} from './AssetTeaser.module.css'

declare type AssetTeaserProps = {
  ddo: DDO
  price: BestPrice
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  ddo,
  price
}: AssetTeaserProps) => {
  const { attributes } = ddo.findServiceByType('metadata')
  const { name, type } = attributes.main
  const { dataTokenInfo } = ddo
  const isCompute = Boolean(ddo?.findServiceByType('compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = ddo.publicKey[0]

  return (
    <article className={`${teaser} ${[type]}`}>
      <Link to={`/asset/${ddo.id}`} className={link}>
        <header>
          <div className={symbol}>{dataTokenInfo?.symbol}</div>
          <Dotdotdot clamp={3}>
            <h1 className={title}>{name}</h1>
          </Dotdotdot>
          <Publisher account={owner} minimal className={publisher} />
        </header>

        <AssetType
          type={type}
          accessType={accessType}
          className={typeDetails}
        />

        <div className={content}>
          <Dotdotdot tagName="p" clamp={3}>
            {removeMarkdown(
              attributes?.additionalInformation?.description || ''
            )}
          </Dotdotdot>
        </div>

        <footer className={foot}>
          <Price price={price} small />
          <p className={date}>
            <Time date={ddo?.created} relative />
          </p>
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
