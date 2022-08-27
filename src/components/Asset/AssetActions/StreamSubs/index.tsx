/* eslint-disable prettier/prettier */
import { useAsset } from '@context/Asset'
import Input from '@shared/FormInput'
import { getFieldContent } from '@utils/form'
import { Field, useFormikContext } from 'formik'
import React from 'react'
import styles from './index.module.css'
import content from '../../../../../content/publish/form.json'
import Copy from '@shared/atoms/Copy'
import { LoggerInstance } from '@oceanprotocol/lib'
import { FormPublishData } from 'src/components/Publish/_types'
import { initialValues } from 'src/components/Publish/_constants'
// import { getAccessDetails } from '@utils/accessDetailsAndPricing'

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
        </>
      )}
    </footer>
  )
}
