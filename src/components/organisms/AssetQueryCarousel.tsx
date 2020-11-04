import AssetTeaser from '../molecules/AssetTeaser'
import React, { ReactElement } from 'react'
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

const Item = ({ ddo }: { ddo: DDO }) => {
  const { attributes } = ddo.findServiceByType('metadata')

  return (
    <AssetTeaser
      ddo={ddo}
      metadata={(attributes as unknown) as MetadataMarket}
    />
  )
}

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 3 },
  1280: { items: 4 }
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
        paddingLeft={50}
        paddingRight={50}
        disableButtonsControls
        animationDuration={300}
        // autoHeight
      />
    </div>
  )
}

export default AssetQueryCarousel
