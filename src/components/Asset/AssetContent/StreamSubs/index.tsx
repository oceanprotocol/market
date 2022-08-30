/* eslint-disable prettier/prettier */
import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'
import Copy from '@shared/atoms/Copy'
import { LoggerInstance } from '@oceanprotocol/lib'

export default function StreamSubs() {
  const { asset } = useAsset()
  LoggerInstance.log('asset_:', asset)

  return (
    <footer className={styles.stats}>
      {!asset ||
      !asset?.accessDetails ||
      !asset?.accessDetails?.validOrderTx ? (
        ''
      ) : (
        <>
          {asset?.metadata?.type === 'datastream' && (
            <div>
              <label className={styles.label}>Datastream EndPoint</label>
              <input type="text" defaultValue={asset.services[0].streamFiles} />
              {asset.services[0].files && (
                <code className={styles.accountId}>
                  <Copy text={asset.services[0].streamFiles} />
                </code>
              )}
              <footer className={styles.stats}></footer>
            </div>
          )}
        </>
      )}
    </footer>
  )
}
