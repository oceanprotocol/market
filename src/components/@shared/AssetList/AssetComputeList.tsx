import React from 'react'
import Dotdotdot from 'react-dotdotdot'
import Link from 'next/link'
import PriceUnit from '@shared/Price/PriceUnit'
import Loader from '@shared/atoms/Loader'
import styles from './AssetComputeList.module.css'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'

function Empty() {
  return <div className={styles.empty}>No assets found.</div>
}

export default function AssetComputeSelection({
  assets
}: {
  assets: AssetSelectionAsset[]
}): JSX.Element {
  return (
    <div className={styles.display}>
      <div className={styles.scroll}>
        {!assets ? (
          <Loader />
        ) : assets && !assets.length ? (
          <Empty />
        ) : (
          assets.map((asset: AssetSelectionAsset) => (
            <Link href={`/asset/${asset.did}`} key={asset.did}>
              <a className={styles.row}>
                <div className={styles.info}>
                  <h3 className={styles.title}>
                    <Dotdotdot clamp={1} tagName="span">
                      {asset.name}
                    </Dotdotdot>
                  </h3>
                  <Dotdotdot clamp={1} tagName="code" className={styles.did}>
                    {asset.symbol} | {asset.did}
                  </Dotdotdot>
                </div>
                <PriceUnit price={asset.price} small className={styles.price} />
              </a>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
