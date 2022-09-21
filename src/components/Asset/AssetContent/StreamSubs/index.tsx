/* eslint-disable prettier/prettier */
import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'
import { LoggerInstance } from '@oceanprotocol/lib'
import { accountTruncate, endpointTruncate } from '@utils/web3'
import Input from '@shared/FormInput'

export default function StreamSubs() {
  const { asset } = useAsset()
  LoggerInstance.log('asset_:', asset)
  const endpointFormatted = endpointTruncate(asset)

  return (
    <div className={styles.stats}>
      <label className={styles.label}>Datastream EndPoint</label>
      <section className={styles.endpoint}>
        <Input
          type="text"
          value={endpointFormatted}
          // readOnly={true}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
          // disabled={true}
          // prefix={accountTruncate(`${asset.services[0].streamFiles}`)}
        />
      </section>
    </div>
  )
}
