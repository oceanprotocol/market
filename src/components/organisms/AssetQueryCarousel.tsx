import AssetTeaser from '../molecules/AssetTeaser'
import React from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import styles from './AssetQueryCarousel.module.css'
import { MetadataMarket } from '../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

const cx = classNames.bind(styles)

declare type AssetQueryCarouselProps = {
  queryResult: QueryResult
  className?: string
}

const responsive = {
  0: { items: 1 },
  600: { items: 2 },
  1280: { items: 3 },
  1600: { items: 4 }
}

const Item = ({ ddo }: { ddo: DDO }) => {
  const { attributes } = ddo.findServiceByType('metadata')

  return (
    <AssetTeaser
      ddo={ddo}
      metadata={(attributes as unknown) as MetadataMarket}
    />
  )
}

const AssetQueryCarousel: React.FC<AssetQueryCarouselProps> = ({
  queryResult,
  className
}) => {
  const styleClasses = cx({
    assetCarousel: true,
    [className]: className
  })

  const items =
    queryResult?.results.length > 0
      ? queryResult.results.map((ddo: DDO) => <Item key={ddo.id} ddo={ddo} />)
      : [
          <div className={styles.empty} key="empty">
            No results found.
          </div>
        ]

  return (
    <div className={styleClasses}>
      <AliceCarousel
        items={items}
        responsive={responsive}
        paddingLeft={10}
        paddingRight={10}
        disableButtonsControls
        animationDuration={300}
      />
    </div>
  )
}

export default AssetQueryCarousel
